// Edge Function "memory-api" — camada HTTP da memória com grafo.
//
// Roda dentro do Supabase, que injeta SUPABASE_URL e
// SUPABASE_SERVICE_ROLE_KEY automaticamente no ambiente da função.
// Por isso ninguém — nem quem chama a API, nem quem mantém o
// servidor MCP ou os workflows n8n — precisa conhecer a service_role
// key: ela nunca sai daqui. Quem chama esta função só precisa da
// anon/publishable key do projeto (pública, usada só para satisfazer
// o verify_jwt do próprio Supabase).
//
// OPENAI_API_KEY é opcional: se configurada como secret da função
// (Supabase Dashboard → Edge Functions → memory-api → Secrets),
// habilita embeddings e busca semantic/hybrid. Sem ela, tudo funciona
// em modo text (full-text).

import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_EMBEDDING_MODEL = Deno.env.get("OPENAI_EMBEDDING_MODEL") || "text-embedding-3-small";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function errorJson(message: string, status = 400) {
  return json({ error: message }, status);
}

async function embed(text: string): Promise<number[] | null> {
  if (!OPENAI_API_KEY) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_EMBEDDING_MODEL, input: text.slice(0, 8000) }),
  });

  if (!res.ok) {
    console.error("embedding falhou:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data.data[0].embedding;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const anchor = segments.indexOf("memory-api");
  const parts = anchor >= 0 ? segments.slice(anchor + 1) : segments;
  const [resource, id] = parts;

  try {
    // POST /nodes — cria nó
    if (resource === "nodes" && req.method === "POST" && !id) {
      const body = await req.json();
      const { type = "note", title, content = "", tags = [], source = "api", metadata = {} } = body;
      if (!title) return errorJson("title é obrigatório");

      const embedding = await embed(`${title}\n\n${content}`);
      const { data, error } = await supabase
        .from("memory_nodes")
        .insert({ type, title, content, tags, source, metadata, embedding })
        .select("id, type, title, tags, created_at")
        .single();

      if (error) return errorJson(error.message, 500);
      return json(data, 201);
    }

    // PATCH /nodes/:id — atualiza nó
    if (resource === "nodes" && req.method === "PATCH" && id) {
      const body = await req.json();
      const patch: Record<string, unknown> = {};
      if (body.title !== undefined) patch.title = body.title;
      if (body.tags !== undefined) patch.tags = body.tags;
      if (body.metadata !== undefined) patch.metadata = body.metadata;
      if (body.content !== undefined) {
        patch.content = body.content;
        patch.embedding = await embed(`${body.title ?? ""}\n\n${body.content}`);
      }

      const { data, error } = await supabase
        .from("memory_nodes")
        .update(patch)
        .eq("id", id)
        .select("id, type, title, tags, updated_at")
        .single();

      if (error) return errorJson(error.message, 500);
      return json(data);
    }

    // GET /nodes/:id — busca por id
    if (resource === "nodes" && req.method === "GET" && id) {
      const { data, error } = await supabase.from("memory_nodes").select("*").eq("id", id).maybeSingle();
      if (error) return errorJson(error.message, 500);
      if (!data) return errorJson("nó não encontrado", 404);
      return json(data);
    }

    // GET /nodes?title=... — busca por título exato
    if (resource === "nodes" && req.method === "GET" && !id) {
      const title = url.searchParams.get("title");
      if (!title) return errorJson("informe ?title=");
      const { data, error } = await supabase
        .from("memory_nodes")
        .select("*")
        .ilike("title", title)
        .limit(1)
        .maybeSingle();
      if (error) return errorJson(error.message, 500);
      if (!data) return errorJson("nó não encontrado", 404);
      return json(data);
    }

    // POST /search — busca text | semantic | hybrid
    if (resource === "search" && req.method === "POST") {
      const body = await req.json();
      const { query, mode = "hybrid", limit = 10, types = null } = body;
      if (!query) return errorJson("query é obrigatório");

      const effectiveMode = mode === "text" || OPENAI_API_KEY ? mode : "text";

      if (effectiveMode === "text") {
        const { data, error } = await supabase.rpc("search_memory_nodes", {
          query,
          match_count: limit,
          filter_types: types,
        });
        if (error) return errorJson(error.message, 500);
        return json(data);
      }

      const queryEmbedding = await embed(query);
      const rpcName = effectiveMode === "semantic" ? "match_memory_nodes" : "hybrid_search_memory";
      const params =
        effectiveMode === "semantic"
          ? { query_embedding: queryEmbedding, match_count: limit, filter_types: types }
          : { query, query_embedding: queryEmbedding, match_count: limit, filter_types: types };

      const { data, error } = await supabase.rpc(rpcName, params);
      if (error) return errorJson(error.message, 500);
      return json(data);
    }

    // POST /links — cria aresta manual
    if (resource === "links" && req.method === "POST") {
      const body = await req.json();
      const { from_id, to_id, relation = "related_to", weight = 1, metadata = {} } = body;
      if (!from_id || !to_id) return errorJson("from_id e to_id são obrigatórios");

      const { data, error } = await supabase
        .from("memory_edges")
        .upsert(
          { from_node: from_id, to_node: to_id, relation, weight, metadata },
          { onConflict: "from_node,to_node,relation" }
        )
        .select()
        .single();

      if (error) return errorJson(error.message, 500);
      return json(data, 201);
    }

    // GET /backlinks/:id
    if (resource === "backlinks" && req.method === "GET" && id) {
      const { data, error } = await supabase.rpc("get_backlinks", { target_id: id });
      if (error) return errorJson(error.message, 500);
      return json(data);
    }

    // GET /graph/:id?depth=2
    if (resource === "graph" && req.method === "GET" && id) {
      const depth = Number(url.searchParams.get("depth") ?? "2");
      const { data, error } = await supabase.rpc("get_graph_neighborhood", {
        start_id: id,
        depth,
      });
      if (error) return errorJson(error.message, 500);
      return json(data);
    }

    return errorJson("rota não encontrada", 404);
  } catch (err) {
    console.error(err);
    return errorJson(err instanceof Error ? err.message : "erro interno", 500);
  }
});
