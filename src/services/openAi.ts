import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getRecommendations(
  movieTitles: string[],
  language: string
): Promise<string[]> {
  const prompt = `
Baseado nestes filmes: ${JSON.stringify(
    movieTitles
  )}, gere um array JSON com 30 filmes semelhantes.
Sem explicações. Apenas o array. ${
    language === 'en' ? 'Respond in English.' : 'Responda em Português.'
  }
  `.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
  });

  const content = response.choices[0].message?.content ?? '[]';
  const match = content.match(/\[.*\]/s);
  return match ? JSON.parse(match[0]) : [];
}
