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
}

export const rooms: Room[] = [
  {
    id: '01',
    title: 'Deluxe Cosy Room',
    client: 'Premium Wing',
    img: '/images/room-deluxe.jpg',
    tagline: 'Complete deluxe room facilities and services beyond satisfaction.',
    description: [
      'The Deluxe Cosy Room at Faith The Retreat offers complete deluxe room facilities and services beyond satisfaction under an unmatchable cost. The deluxe room offers the best setup for a cosy stay keeping safety, hygiene and comfort in mind.',
      'Featuring elegant furnishings, a comfortable queen bed, a private sitting area with bamboo chairs, and warm ambient lighting. The room is fully air-conditioned with complimentary breakfast and all modern amenities for a memorable stay.',
    ],
    features: [
      'Fully air-conditioned with temperature control',
      'Complimentary breakfast included',
      'Private sitting area with bamboo furniture',
      'Queen bed with premium linens',
      'En-suite bathroom with hot/cold water',
      'Flat-screen TV and free Wi-Fi',
    ],
    price: '\u20B91,180',
    priceNote: 'per night, taxes included',
    sqm: '28m\u00B2',
    occupancy: '2 guests',
    bed: 'Queen bed',
  },
  {
    id: '02',
    title: 'Standard Room (AC)',
    client: 'Comfort Wing',
    img: '/images/room-standard.jpg',
    tagline: 'The best option for budget travelling with all quality services.',
    description: [
      'The Standard AC Room at Faith The Retreat is the best option for budget travellers. Boasting all the necessary amenities including air-conditioning, complimentary breakfast and clean beds, this is your go-to choice for a decent cost.',
      'Well-maintained with tiled flooring, a comfortable double bed, writing desk, and a flat-screen TV. The room provides excellent value with hygiene, comfort and room service that exceeds expectations.',
    ],
    features: [
      'Air-conditioned with split AC unit',
      'Complimentary breakfast included',
      'Clean, comfortable double bed',
      'Writing desk and chair',
      'Flat-screen TV',
      'En-suite bathroom with modern fittings',
    ],
    price: '\u20B91,080',
    priceNote: 'per night, taxes included',
    sqm: '22m\u00B2',
    occupancy: '2 guests',
    bed: 'Double bed',
  },
  {
    id: '03',
    title: 'Backpacker Beds',
    client: 'Traveller Wing',
    img: '/images/room-backpacker.jpg',
    tagline: 'Best suited for adventure travellers and backpackers.',
    description: [
      'The Single & Double Bed accommodation at Faith The Retreat is best suited for adventure travellers or backpackers looking for comfortable, budget-friendly and cosy stays in Siliguri.',
      'A communal yet comfortable space with clean single beds, shared facilities, and a warm, social atmosphere. Perfect for solo travellers or friends exploring the Seven Sisters of Eastern India, Sikkim, and Bhutan.',
    ],
    features: [
      'Clean and comfortable single/twin beds',
      'Budget-friendly pricing',
      'Shared bathroom facilities',
      'Common lounge area',
      'Free Wi-Fi access',
      'Secure luggage storage',
    ],
    price: '\u20B9850',
    priceNote: 'per night, per person',
    sqm: '18m\u00B2',
    occupancy: '1-2 guests',
    bed: 'Single / Twin beds',
  },
  {
    id: '04',
    title: 'Superior Cosy Room',
    client: 'Elite Wing',
    img: '/images/room-superior.jpg',
    tagline: 'Fully furnished with elements of a lavish stay.',
    description: [
      'The Superior Cosy Room at Faith The Retreat is fully furnished with elite elements of a lavish stay. Completely air-conditioned and designed to provide you with ultimate comfort and lift up your relaxation mood.',
      'This premium room features a king-size bed with luxury linens, an elegant chandelier, carved wooden furnishings, and a private en-suite bathroom with a freestanding bathtub for a truly luxurious experience.',
    ],
    features: [
      'King bed with luxury linens',
      'Freestanding bathtub in en-suite bathroom',
      'Fully air-conditioned',
      'Elegant chandelier and decor',
      'Carved wooden furnishings',
      'Complimentary breakfast and premium toiletries',
    ],
    price: '\u20B91,580',
    priceNote: 'per night, taxes included',
    sqm: '35m\u00B2',
    occupancy: '2 guests',
    bed: 'King bed',
  },
  {
    id: '05',
    title: 'AC Room for 3 Pax',
    client: 'Group Wing',
    img: '/images/room-triple.jpg',
    tagline: 'Super affordable and cost-effective stay for group travellers.',
    description: [
      'The AC Room for 3 Pax at Faith The Retreat is a super affordable and cost-effective stay for travellers and visitors. Fully air-conditioned with all amenities ensuring hygiene, comfort and excellent room service.',
      'The most suitable and ideal accommodation for group travelling, this spacious room features three single beds, a seating area, and ample storage. Perfect for friends or colleagues travelling together through Siliguri.',
    ],
    features: [
      'Three comfortable single beds',
      'Fully air-conditioned',
      'Spacious with seating area',
      'Complimentary breakfast',
      'Flat-screen TV and free Wi-Fi',
      'Ideal for group travellers',
    ],
    price: '\u20B91,480',
    priceNote: 'per night, taxes included',
    sqm: '32m\u00B2',
    occupancy: '3 guests',
    bed: '3 single beds',
  },
  {
    id: '06',
    title: 'Family Suite',
    client: 'Family Wing',
    img: '/images/room-family.jpg',
    tagline: 'A spacious retreat for families seeking comfort together.',
    description: [
      'The Family Suite at Faith The Retreat offers a warm and inviting space designed for families. With a king-size bed and an additional single bed, there is ample room for parents and children to relax comfortably.',
      'Featuring a private seating area with sofa, traditional Indian decor elements, wooden flooring, and all modern amenities. The suite provides the perfect blend of homely warmth and premium comfort for a memorable family staycation.',
    ],
    features: [
      'King bed + additional single bed',
      'Private seating area with sofa',
      'Fully air-conditioned',
      'Traditional decor with modern amenities',
      'Complimentary breakfast for all guests',
      'Spacious en-suite bathroom',
    ],
    price: '\u20B91,680',
    priceNote: 'per night, taxes included',
    sqm: '40m\u00B2',
    occupancy: '3-4 guests',
    bed: 'King + Single bed',
  },
]
