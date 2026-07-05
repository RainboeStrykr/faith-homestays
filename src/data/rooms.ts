export interface Room {
  id: string
  title: string
  client: string
  img: string
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote: string
  sqm: string
  occupancy: string
  bed: string
  /** If true, price is per bed/person and multiplies by guest count */
  perBed?: boolean
  /** Maximum number of beds/guests selectable (defaults to 4) */
  maxGuests?: number
  /**
   * Total capacity of this listing (number of beds/units).
   * A room is sold out when confirmed bookings for an overlapping date range
   * consume all capacity. Defaults to 1 for standard rooms.
   */
  capacity?: number
}

export const rooms: Room[] = [
  {
    id: '01',
    title: 'Standard Deluxe Cosy Room',
    client: 'Premium & Family Collection',
    img: '/images/room-deluxe.jpg',
    tagline: 'Premium comfort with a cosy, intimate touch.',
    description: [
      'Experience premium hospitality in our thoughtfully designed Cosy Room. Perfect for travellers who prefer a snug, warm atmosphere, this room features a plush double bed and the ultimate convenience of a private attached washroom.',
      'Enjoy high-end amenities and elegant interiors in a beautifully curated space without the chill of air conditioning, ensuring a comfortable and relaxing environment.'
    ],
    features: [
      'Premium non-AC environment for a warm, cosy stay',
      'Comfortable double bed with premium linens',
      'Private attached washroom for maximum convenience',
      'Elegant, high-quality interiors',
      'Ideal for couples seeking an intimate, budget-friendly retreat'
    ],
    price: '₹1,650',
    priceNote: 'per night, taxes included',
    sqm: '28m²',
    occupancy: '2 guests',
    bed: 'Double bed',
  },
  {
    id: '02',
    title: 'Superior Deluxe AC Room',
    client: 'Premium & Family Collection',
    img: '/images/room-superior.jpg',
    tagline: 'The pinnacle of premium comfort and climate-controlled luxury.',
    description: [
      'Indulge in our top-tier Superior Deluxe Room, where luxury meets perfect climate control. Designed for guests who refuse to compromise on comfort, this premium suite offers a spacious double bed, a pristine attached washroom, and powerful air conditioning.',
      'Enjoy a flawless, relaxing stay in any weather with upgraded furnishings, high-end design elements, and a serene, quiet environment tailored for premium relaxation.'
    ],
    features: [
      'Fully air-conditioned premium room',
      'Spacious, comfortable double bed',
      'Private attached washroom',
      'Top-tier furnishings and upgraded amenities',
      'Perfect for a luxurious couple\'s getaway or business travellers'
    ],
    price: '₹2,450',
    priceNote: 'per night, taxes included',
    sqm: '35m²',
    occupancy: '2 guests',
    bed: 'Double bed',
  },
  {
    id: '03',
    title: 'Premium Family Suite',
    client: 'Premium & Family Collection',
    img: '/images/room-family.jpg',
    tagline: 'Spacious, premium accommodations designed for family togetherness.',
    description: [
      'Create unforgettable memories with our expansive Family Suite. Tailored specifically for groups and families, this premium room features a comfortable triple-bed setup and powerful air conditioning to keep everyone cool and relaxed.',
      'Enjoy the extra space and premium ambience, with clean, well-maintained shared washroom facilities just steps away, offering the perfect blend of luxury and practical value for your family.'
    ],
    features: [
      'Premium air-conditioned space',
      'Triple bed configuration (sleeps up to 3)',
      'Spacious layout perfect for families or small groups',
      'Access to premium shared washroom facilities',
      'Excellent value for group accommodations'
    ],
    price: '₹2,300',
    priceNote: 'per night, taxes included',
    sqm: '40m²',
    occupancy: '3 guests',
    bed: 'Triple bed',
  },
  {
    id: '04',
    title: 'Standard Deluxe AC Room',
    client: 'Standard Comfort & Value Rooms',
    img: '/images/room-standard.jpg',
    tagline: 'The perfect balance of modern comfort and everyday value.',
    description: [
      'Upgrade your stay with our Standard Deluxe Room, offering the refreshing comfort of air conditioning at a highly competitive price. Featuring a comfortable double bed and a welcoming standard-tier ambience.',
      'This room provides a great base for your travels, with convenient access to our well-kept shared washrooms and reliable room services designed for budget-conscious travellers who value climate control.'
    ],
    features: [
      'Air-conditioned standard room',
      'Comfortable double bed',
      'Access to clean, well-maintained shared washrooms',
      'Great value for money',
      'Ideal for budget-conscious travellers who want the comfort of AC'
    ],
    price: '₹1,750',
    priceNote: 'per night, taxes included',
    sqm: '25m²',
    occupancy: '2 guests',
    bed: 'Double bed',
  },
  {
    id: '05',
    title: 'Standard Backpacker\'s Twin Room',
    client: 'Standard Comfort & Value Rooms',
    img: '/images/room-backpacker.jpg',
    tagline: 'Affordable, friendly, and perfectly sized for travelling companions.',
    description: [
      'Hit the road without breaking the bank in our Standard Backpacker\'s Room. Designed with the budget-conscious explorer in mind, this room offers two comfortable beds, making it perfect for friends travelling together.',
      'Enjoy a no-frills, relaxed environment with access to our standard shared washroom facilities, located conveniently nearby. It is a fantastic choice for companions exploring the region.'
    ],
    features: [
      'Non-AC standard room (fan-cooled)',
      'Two separate beds (Twin setup)',
      'Ideal for friends, siblings, or travel buddies',
      'Access to shared washroom facilities',
      'Highly affordable rates for longer stays'
    ],
    price: '₹1,250',
    priceNote: 'per night, taxes included',
    sqm: '22m²',
    occupancy: '2 guests',
    bed: 'Twin beds',
  },
  {
    id: '06',
    title: 'Standard Cosy Room',
    client: 'Standard Comfort & Value Rooms',
    img: '/images/room-triple.jpg',
    tagline: 'A warm, budget-friendly haven for your travels.',
    description: [
      'Unwind in our charming Standard Cosy Room, designed to provide a warm and inviting atmosphere at an unbeatable price. Featuring a comfortable separate double bed and a relaxed non-AC environment.',
      'This room is a fantastic choice for solo travellers or couples looking for a simple, clean, and economical place to rest, recharge, and enjoy their stay without unnecessary expenses.'
    ],
    features: [
      'Non-AC cosy environment',
      'Separate double bed setup',
      'Highly economical pricing',
      'Access to shared washrooms',
      'Perfect for short stays, transit passengers, and budget travellers'
    ],
    price: '₹1,050',
    priceNote: 'per night, taxes included',
    sqm: '20m²',
    occupancy: '2 guests',
    bed: 'Double bed',
  },
  {
    id: '07',
    title: 'Standard Single Room',
    client: 'Standard Comfort & Value Rooms',
    img: '/images/room-standard.jpg',
    tagline: 'Simple, clean, and incredibly affordable.',
    description: [
      'Looking for the ultimate budget-friendly basecamp? Our Standard Single Room offers exactly what you need for a good night\'s sleep without the extra cost. Featuring a cosy single bed and a straightforward, clean setup.',
      'It’s the smartest choice for solo adventurers, students, or transit passengers prioritising savings and convenience while retaining easy access to all shared guest facilities.'
    ],
    features: [
      'Most affordable room option in the property',
      'Single bed setup',
      'Non-AC standard environment',
      'Access to shared washroom facilities',
      'Perfect for solo travellers, students, and backpackers on a strict budget'
    ],
    price: '₹800',
    priceNote: 'per night, taxes included',
    sqm: '15m²',
    occupancy: '1 guest',
    bed: 'Single bed',
  },
  {
    id: '08',
    title: 'Premium AC Dormitory - Mixed Bunk',
    client: 'Backpacker Dormitories',
    img: '/images/dorms-1.jpg',
    tagline: 'Cool, social, and premium comfort for the solo explorer.',
    description: [
      'Join our vibrant community in our Premium Air-Conditioned Public Dormitory. Book your own single bunk bed in a lively, shared room designed for socialising and meeting fellow travellers from around the globe.',
      'Enjoy the premium perk of full air conditioning, ensuring you stay cool and comfortable while making new friends, exchanging stories, and planning your next adventure.'
    ],
    features: [
      'Single bunk bed in a shared public dorm',
      'Fully air-conditioned premium space',
      'Great for socialising, networking, and meeting travellers',
      'Per-person pricing (Occupancy = 1)',
      'Secure and comfortable sleeping setup with shared facilities'
    ],
    price: '₹850',
    priceNote: 'per night, per person',
    sqm: '18m²',
    occupancy: '1 guest',
    bed: 'Single bunk bed',
    perBed: true,
    maxGuests: 6,
    capacity: 6,
  },
  {
    id: '09',
    title: 'Premium AC Dormitory - Private Bunk',
    client: 'Backpacker Dormitories',
    img: '/images/dorms-2.jpg',
    tagline: 'The social vibe of a hostel with the peace you need.',
    description: [
      'Experience the best of both worlds in our Premium Air-Conditioned Private Dormitory. Secure your single bunk bed in a quieter, exclusive shared room that offers a more peaceful atmosphere than our public dorms.',
      'It\'s the perfect solution for travellers who want premium AC and hostel affordability without sacrificing their rest, making it ideal for light sleepers and remote workers.'
    ],
    features: [
      'Single bunk bed in a private/exclusive dorm setting',
      'Fully air-conditioned premium space',
      'Quieter environment designed for better sleep',
      'Per-person pricing (Occupancy = 1)',
      'Ideal for light sleepers, remote workers, and introverted travellers'
    ],
    price: '₹950',
    priceNote: 'per night, per person',
    sqm: '18m²',
    occupancy: '1 guest',
    bed: 'Single bunk bed',
    perBed: true,
    maxGuests: 4,
    capacity: 4,
  }
]

/**
 * Parses a price string like "₹1,650" and returns the numeric value.
 * Returns null if the string can't be parsed.
 */
export function parsePriceValue(price: string): number | null {
  // Strip currency symbols, spaces, commas — keep digits and decimal point
  const cleaned = price.replace(/[^\d.]/g, '')
  const val = parseFloat(cleaned)
  return isNaN(val) ? null : val
}

/**
 * Given a base price string and a guest count, returns the total price string.
 * For perBed rooms the price scales linearly with guests.
 * The currency prefix (₹) is preserved.
 */
export function calcTotalPrice(basePrice: string, guests: number): string {
  const numeric = parsePriceValue(basePrice)
  if (numeric === null) return basePrice
  const total = numeric * guests
  // Re-apply the ₹ prefix and format with commas
  return '₹' + total.toLocaleString('en-IN')
}
