const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

export const embeddingsEnabled = Boolean(OPENAI_API_KEY);

// Gera o embedding de um texto via API da OpenAI. Retorna null quando
// OPENAI_API_KEY não está configurada — quem chama deve degradar
// para busca full-text nesse caso, não falhar.
export async function embed(text) {
  if (!embeddingsEnabled) return null;

  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: text.slice(0, 8000),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI embeddings falhou (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.data[0].embedding;
}
