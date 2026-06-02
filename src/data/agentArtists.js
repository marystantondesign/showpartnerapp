// 100 seeded artists for the Agent desktop view

const FIRST = [
  'Emma','Sofia','Aisha','Luna','Priya','Zoe','Maya','Nadia','Yuki','Amara',
  'Leila','Rina','Camille','Astrid','Beatrice','Claudia','Fatima','Ingrid','Soo','Valentina',
  'Jasmine','Freya','Sienna','Charlotte','Victoria','Olivia','Natalie','Isabelle','Chloe','Audrey',
  'Diana','Elena','Fiona','Grace','Hana','Iris','Julia','Kylie','Lily','Maria',
  'Nina','Ophelia','Penelope','Rosa','Stella','Tara','Uma','Vera','Wren','Yasmin',
  'Anya','Bibi','Cara','Daphne','Eva','Gigi','Harlow','Imani','Juno','Kira',
  'Lola','Mia','Nova','Opal','Poppy','Remi','Reina','Sasha','Tessa','Ursula',
  'Vivi','Winona','Xia','Yara','Zuri','Adele','Blanche','Cosima','Deja','Esme',
  'Fleur','Gaia','Hera','Indra','Jovie','Kaia','Laia','Marta','Nour','Paloma',
  'Soraya','Tamika','Valeria','Waverly','Xara','Yolanda','Zola','Ife','Cece','Roux',
]

const LAST = [
  'Chen','Williams','Garcia','Kim','Patel','Lee','Park','Johnson','Martinez','Brown',
  'Wilson','Anderson','Taylor','Davis','Clark','Lewis','Robinson','Walker','Hall','Allen',
  'Young','Hernandez','King','Wright','Lopez','Hill','Scott','Green','Adams','Baker',
  'Gonzalez','Nelson','Carter','Mitchell','Perez','Roberts','Turner','Phillips','Campbell','Parker',
  'Evans','Edwards','Collins','Stewart','Sanchez','Morris','Rogers','Reed','Cook','Morgan',
]

const CITIES   = ['New York','Paris','Milan','London','Los Angeles','Tokyo','Sydney','Berlin']
const SPECS    = ['hair','makeup','nails']
const DESIGNERS = ['Valentino','Prada','Jacquemus','Oscar de la Renta','Diesel','Chanel','Dior',
                   'Givenchy','Balenciaga','Saint Laurent','Versace','Fendi','Bottega Veneta',
                   'Burberry','Alexander McQueen']
const SKILLS = {
  hair:   ['Hair extensions','Avant-garde color','Braiding','Wig styling','Color correction','Natural glam'],
  makeup: ['Eyebrow bleaching','Editorial makeup','Airbrush','Special effects','Natural glam','Avant-garde color'],
  nails:  ['Nail art','Gel extensions','Acrylic','Press-on sets','Tooth gems','Airbrush'],
}

const SHOW_NAMES = ['Valentino FW24','Prada SS25','Chanel FW24','Dior SS25',
                    'Balenciaga FW25','Givenchy SS24','Versace FW24','Fendi SS25']
const SHOW_DATES = ['Oct 2024','Mar 2025','Jan 2025','Feb 2025','Nov 2024','Jun 2024','Sep 2024','Feb 2025']

function pick(arr, seed, count = 1, offset = 0) {
  const result = []
  const seen = new Set()
  let k = (seed + offset) % arr.length
  while (result.length < Math.min(count, arr.length)) {
    if (!seen.has(arr[k])) { result.push(arr[k]); seen.add(arr[k]) }
    k = (k + 7) % arr.length
  }
  return result
}

export const AGENT_ARTISTS = Array.from({ length: 100 }, (_, i) => {
  const spec       = SPECS[i % 3]
  const skillPool  = SKILLS[spec]
  const numDesigners = 2 + (i % 4)
  const numSkills    = 2 + ((i * 3) % 3)
  const experience   = 2 + ((i * 3 + 1) % 24)
  const timesBooked  = 10 + ((i * 47 + 13) % 491)
  const rawRating    = 3.2 + ((i * 17 + 5) % 18) / 10
  const rating       = Math.round(rawRating * 10) / 10
  const ratingCount  = 4 + ((i * 9 + 2) % 97)
  const hourlyRate   = 85 + ((i * 23 + 7) % 216)
  const numHistory   = i % 3 === 0 ? 2 : i % 3 === 1 ? 1 : 0
  const firstName    = FIRST[i]
  const lastName     = LAST[i % 50]

  return {
    id:          `ag-${i + 1}`,
    name:        `${firstName} ${lastName}`,
    specialty:   spec,
    city:        CITIES[i % 8],
    experience,
    timesBooked,
    rating,
    ratingCount,
    hourlyRate,
    designers:   pick(DESIGNERS, i, numDesigners),
    skills:      pick(skillPool, i, numSkills, 3),
    email:       `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@talent.io`,
    phone:       `+1 ${200 + (i % 800)} 555-${String(1000 + i).slice(1)}`,
    avatar:      `https://i.pravatar.cc/150?img=${(i % 69) + 1}`,
    notes:       '',
    portfolioUrl: '#',
    showHistory: Array.from({ length: numHistory }, (_, j) => ({
      show:   SHOW_NAMES[(i + j) % SHOW_NAMES.length],
      date:   SHOW_DATES[(i + j) % SHOW_DATES.length],
      role:   spec.charAt(0).toUpperCase() + spec.slice(1) + ' Artist',
      rating: 3 + ((i + j) % 3),
    })),
  }
})
