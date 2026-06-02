import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { query } = req.body || {}
  if (!query) return res.status(400).json({ error: 'Missing query' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'API key not configured', filters: {} })
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: 'You are a filter engine. The user will describe what kind of artist they\'re looking for. Return ONLY a JSON object with these possible keys: specialty (HAIR/MAKEUP/NAILS), city (string), maxRate (number), minRating (number), designers (array of strings), skills (array of strings), minYears (number). Only include keys that are clearly specified. Return nothing else — no explanation, no markdown.',
      messages: [{ role: 'user', content: query }]
    })

    const text = message.content[0]?.text?.trim() || '{}'
    let filters = {}
    try {
      // Strip any accidental markdown code fences
      const clean = text.replace(/^```[a-z]*\n?/,'').replace(/\n?```$/,'').trim()
      filters = JSON.parse(clean)
    } catch { filters = {} }

    return res.json({ filters })
  } catch (err) {
    console.error('Anthropic error:', err)
    return res.status(500).json({ error: err.message, filters: {} })
  }
}
