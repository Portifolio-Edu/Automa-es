#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { embed, embeddingsEnabled } from "./embeddings.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios (veja .env.example)."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const NODE_TYPES = [
  "note",
  "entity",
  "project",
  "decision",
  "person",
  "concept",
  "automation",
  "session",
];

function jsonResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function errorResult(message) {
  return {
    content: [{ type: "text", text: `Erro: ${message}` }],
    isError: true,
  };
}

const server = new McpServer({
  name: "memoria-grafo",
  version: "1.0.0",
});

server.tool(
  "memory_create_node",
  "Cria um nó de memória (nota, decisão, entidade, projeto...). Links no formato [[Título]] no conteúdo viram backlinks automaticamente para nós existentes com esse título.",
  {
    type: z.enum(NODE_TYPES).default("note"),
    title: z.string().min(1),
    content: z.string().default(""),
    tags: z.array(z.string()).default([]),
    source: z.enum(["manual", "claude", "n8n", "api"]).default("claude"),
    metadata: z.record(z.any()).default({}),
  },
  async ({ type, title, content, tags, source, metadata }) => {
    const embedding = await embed(`${title}\n\n${content}`).catch((err) => {
      console.error("embedding falhou, seguindo sem vetor:", err.message);
      return null;
    });

    const { data, error } = await supabase
      .from("memory_nodes")
      .insert({ type, title, content, tags, source, metadata, embedding })
      .select("id, type, title, tags, created_at")
      .single();

    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

server.tool(
  "memory_update_node",
  "Atualiza título/conteúdo/tags/metadata de um nó existente. Reprocessa embedding e backlinks automáticos quando o conteúdo muda.",
  {
    id: z.string().uuid(),
    title: z.string().optional(),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
  },
  async ({ id, title, content, tags, metadata }) => {
    const patch = {};
    if (title !== undefined) patch.title = title;
    if (tags !== undefined) patch.tags = tags;
    if (metadata !== undefined) patch.metadata = metadata;
    if (content !== undefined) {
      patch.content = content;
      patch.embedding = await embed(`${title ?? ""}\n\n${content}`).catch((err) => {
        console.error("embedding falhou, seguindo sem vetor:", err.message);
        return null;
      });
    }

    const { data, error } = await supabase
      .from("memory_nodes")
      .update(patch)
      .eq("id", id)
      .select("id, type, title, tags, updated_at")
      .single();

    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

server.tool(
  "memory_get_node",
  "Busca um nó pelo id (uuid) ou pelo título exato.",
  {
    id: z.string().uuid().optional(),
    title: z.string().optional(),
  },
  async ({ id, title }) => {
    if (!id && !title) return errorResult("informe id ou title");

    let query = supabase.from("memory_nodes").select("*");
    query = id ? query.eq("id", id) : query.ilike("title", title);

    const { data, error } = await query.limit(1).maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult("nó não encontrado");
    return jsonResult(data);
  }
);

server.tool(
  "memory_search",
  `Busca nós na memória. modo "text" usa full-text (rápido, exato), "semantic" usa embeddings (por significado), "hybrid" combina os dois via Reciprocal Rank Fusion (recomendado). "semantic"/"hybrid" exigem OPENAI_API_KEY configurada no servidor${embeddingsEnabled ? " (disponível)" : " (INDISPONÍVEL — cai para text)"}.`,
  {
    query: z.string().min(1),
    mode: z.enum(["text", "semantic", "hybrid"]).default("hybrid"),
    limit: z.number().int().min(1).max(50).default(10),
    types: z.array(z.enum(NODE_TYPES)).optional(),
  },
  async ({ query, mode, limit, types }) => {
    const filterTypes = types && types.length ? types : null;
    const effectiveMode = mode === "text" || embeddingsEnabled ? mode : "text";

    if (effectiveMode === "text") {
      const { data, error } = await supabase.rpc("search_memory_nodes", {
        query,
        match_count: limit,
        filter_types: filterTypes,
      });
      if (error) return errorResult(error.message);
      return jsonResult(data);
    }

    const queryEmbedding = await embed(query);
    const rpcName = effectiveMode === "semantic" ? "match_memory_nodes" : "hybrid_search_memory";
    const params =
      effectiveMode === "semantic"
        ? { query_embedding: queryEmbedding, match_count: limit, filter_types: filterTypes }
        : {
            query,
            query_embedding: queryEmbedding,
            match_count: limit,
            filter_types: filterTypes,
          };

    const { data, error } = await supabase.rpc(rpcName, params);
    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

server.tool(
  "memory_link",
  "Cria uma aresta manual entre dois nós (ex: depends_on, caused_by, part_of, mentions). Use quando a relação não vem de um [[wikilink]] no texto.",
  {
    from_id: z.string().uuid(),
    to_id: z.string().uuid(),
    relation: z.string().min(1).default("related_to"),
    weight: z.number().default(1),
    metadata: z.record(z.any()).default({}),
  },
  async ({ from_id, to_id, relation, weight, metadata }) => {
    const { data, error } = await supabase
      .from("memory_edges")
      .upsert(
        { from_node: from_id, to_node: to_id, relation, weight, metadata },
        { onConflict: "from_node,to_node,relation" }
      )
      .select()
      .single();

    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

server.tool(
  "memory_backlinks",
  "Lista quem aponta para um nó (backlinks), como no painel lateral do Obsidian.",
  { id: z.string().uuid() },
  async ({ id }) => {
    const { data, error } = await supabase.rpc("get_backlinks", { target_id: id });
    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

server.tool(
  "memory_graph",
  "Retorna a vizinhança do grafo local a partir de um nó, até N saltos (default 2) — equivalente ao 'local graph' do Obsidian.",
  {
    id: z.string().uuid(),
    depth: z.number().int().min(1).max(5).default(2),
  },
  async ({ id, depth }) => {
    const { data, error } = await supabase.rpc("get_graph_neighborhood", {
      start_id: id,
      depth,
    });
    if (error) return errorResult(error.message);
    return jsonResult(data);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("memoria-grafo MCP server rodando (stdio)");
