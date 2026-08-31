#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// A Edge Function "memory-api" roda dentro do Supabase e usa a
// service_role key internamente (injetada automaticamente pelo
// Supabase, ninguém precisa configurá-la aqui). Este servidor só
// fala com ela por HTTPS usando a chave pública (anon/publishable)
// do projeto — por isso os valores abaixo já vêm preenchidos e
// funcionam sem nenhuma configuração manual.
const MEMORY_API_URL =
  process.env.MEMORY_API_URL ||
  "https://bebewljjouhqwpzmgeks.supabase.co/functions/v1/memory-api";
const MEMORY_API_KEY =
  process.env.MEMORY_API_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYmV3bGpqb3VocXdwem1nZWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTgyMTAsImV4cCI6MjEwMzc3NDIxMH0.qkGQffkslopGgvNP3aZbm-ceYhv2AlEmbJef8yOnDDA";

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

async function callApi(path, { method = "GET", body } = {}) {
  const res = await fetch(`${MEMORY_API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MEMORY_API_KEY}`,
      apikey: MEMORY_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `memory-api respondeu ${res.status}`);
  }
  return data;
}

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
  async (input) => {
    try {
      return jsonResult(await callApi("/nodes", { method: "POST", body: input }));
    } catch (err) {
      return errorResult(err.message);
    }
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
  async ({ id, ...patch }) => {
    try {
      return jsonResult(await callApi(`/nodes/${id}`, { method: "PATCH", body: patch }));
    } catch (err) {
      return errorResult(err.message);
    }
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
    try {
      const path = id ? `/nodes/${id}` : `/nodes?title=${encodeURIComponent(title)}`;
      return jsonResult(await callApi(path));
    } catch (err) {
      return errorResult(err.message);
    }
  }
);

server.tool(
  "memory_search",
  'Busca nós na memória. modo "text" usa full-text (rápido, exato), "semantic" usa embeddings (por significado), "hybrid" combina os dois via Reciprocal Rank Fusion (recomendado). "semantic"/"hybrid" só funcionam se a Edge Function tiver OPENAI_API_KEY configurada como secret — sem isso, o servidor cai automaticamente para "text".',
  {
    query: z.string().min(1),
    mode: z.enum(["text", "semantic", "hybrid"]).default("hybrid"),
    limit: z.number().int().min(1).max(50).default(10),
    types: z.array(z.enum(NODE_TYPES)).optional(),
  },
  async (input) => {
    try {
      return jsonResult(await callApi("/search", { method: "POST", body: input }));
    } catch (err) {
      return errorResult(err.message);
    }
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
  async (input) => {
    try {
      return jsonResult(await callApi("/links", { method: "POST", body: input }));
    } catch (err) {
      return errorResult(err.message);
    }
  }
);

server.tool(
  "memory_backlinks",
  "Lista quem aponta para um nó (backlinks), como no painel lateral do Obsidian.",
  { id: z.string().uuid() },
  async ({ id }) => {
    try {
      return jsonResult(await callApi(`/backlinks/${id}`));
    } catch (err) {
      return errorResult(err.message);
    }
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
    try {
      return jsonResult(await callApi(`/graph/${id}?depth=${depth}`));
    } catch (err) {
      return errorResult(err.message);
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("memoria-grafo MCP server rodando (stdio)");
