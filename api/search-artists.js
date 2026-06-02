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
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `You are a search assistant for an artist database used by fashion show coordinators.

Parse this natural language query and return a JSON filter object.

Query: "${query}"

Available filter fields:
- specialty: "hair" | "makeup" | "nails" | null
- cities: string[] | null  (valid values: "New York", "Paris", "Milan", "London", "Los Angeles", "Tokyo", "Sydney", "Berlin")
- minHourlyRate: number | null
- maxHourlyRate: number | null
- minRating: number | null  (1.0–5.0)
- minExperience: number | null  (years)
- maxHourlyRate: number | null
- designerTags: string[] | null  (valid values: Valentino, Prada, Jacquemus, Oscar de la Renta, Diesel, Chanel, Dior, Givenchy, Balenciaga, Saint Laurent, Versace, Fendi, Bottega Veneta, Burberry, Alexander McQueen)
- skillTags: string[] | null  (valid values: Eyebrow bleaching, Hair extensions, Tooth gems, Editorial makeup, Avant-garde color, Airbrush, Special effects, Natural glam, Nail art, Gel extensions, Acrylic, Press-on sets, Braiding, Wig styling, Color correction)

Respond with only valid JSON, no explanation or markdown. Example:
{"specialty":"nails","cities":["New York"],"maxHourlyRate":100,"minRating":null,"minExperience":null,"designerTags":null,"skillTags":null}`
      }]
    })

    const text = message.content[0]?.text?.trim() || '{}'
    let filters = {}
    try { filters = JSON.parse(text) } catch { filters = {} }
    return res.json({ filters })
  } catch (err) {
    console.error('Anthropic error:', err)
    return res.status(500).json({ error: err.message, filters: {} })
  }
}
