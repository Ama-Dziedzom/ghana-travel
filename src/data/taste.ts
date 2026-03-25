export interface Top10Item {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating?: number;
  highlight?: string;
}

export interface RegionTop10 {
  region: string;
  occasions: {
    name: string;
    items: Top10Item[];
  }[];
}

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Western",
  "Volta",
  "Eastern",
  "Northern",
];

export const MOCK_RESTAURANTS: RegionTop10[] = GHANA_REGIONS.map(region => ({
  region,
  occasions: [
    {
      name: "Breakfast",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: `res-b-${region}-${i}`,
        name: `${region} Breakfast Spot ${i + 1}`,
        location: `Main Street, ${region}`,
        description: `Experience the best local and continental breakfast in ${region}. Our Waakye and Omotuo are legendary.`,
        image: `/images/taste-breakfast.png`,
        highlight: i === 0 ? "Chef's Choice" : undefined,
      })),
    },
    {
      name: "Lunch",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: `res-l-${region}-${i}`,
        name: `${region} Lunch Haven ${i + 1}`,
        location: `Ocean View Ave, ${region}`,
        description: `The perfect spot for a midday break. Hearty portions and amazing Jollof rice that will keep you going all day.`,
        image: `/images/taste-lunch.png`,
      })),
    },
    {
      name: "Dinner",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: `res-d-${region}-${i}`,
        name: `${region} Evening Star ${i + 1}`,
        location: `Hillside Gardens, ${region}`,
        description: `Fine dining meets Ghanaian hospitality. Perfect for a romantic evening or a celebratory family dinner.`,
        image: `/images/taste-dinner.png`,
      })),
    },
  ],
}));

export const MOCK_CAFES: RegionTop10[] = GHANA_REGIONS.map(region => ({
  region,
  occasions: [
    {
      name: "Work & Coffee",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: `cafe-w-${region}-${i}`,
        name: `${region} Coffee Hub ${i + 1}`,
        location: `Tech Plaza, ${region}`,
        description: `Fast Wi-Fi, premium Ghanaian coffee, and a quiet atmosphere perfect for productivity.`,
        image: `/images/taste-cafe.png`,
      })),
    },
    {
      name: "Pastries & Chill",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: `cafe-p-${region}-${i}`,
        name: `${region} Pastry Shop ${i + 1}`,
        location: `Market Square, ${region}`,
        description: `The smell of fresh bread and cakes welcomes you. Try our signature meat pies and bissap juice.`,
        image: `/images/taste-cafe.png`,
      })),
    },
  ],
}));
