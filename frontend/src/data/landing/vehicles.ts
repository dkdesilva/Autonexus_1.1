import { Vehicle } from '../../types/landing/index';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model S',
    type: 'Electric Sedan',
    price: 89990,
    year: 2023,
    mileage: 0,
    image: 'https://images.pexels.com/photos/12861302/pexels-photo-12861302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Autopilot', '396mi Range', '1,020hp', 'Ludicrous Mode'],
  },
  {
    id: '2',
    name: 'BMW X5',
    type: 'Luxury SUV',
    price: 65700,
    year: 2023,
    mileage: 1200,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['All-Wheel Drive', 'Panoramic Sunroof', 'Premium Sound System', 'Advanced Safety'],
  },
  {
    id: '3',
    name: 'Ford F-150',
    type: 'Pickup Truck',
    price: 52000,
    year: 2023,
    mileage: 500,
    image: 'https://images.pexels.com/photos/2490641/pexels-photo-2490641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Towing Capacity: 14,000 lbs', 'Pro Power Onboard', 'SYNC 4', 'Zone Lighting'],
  },
  {
    id: '4',
    name: 'Honda Civic',
    type: 'Compact Sedan',
    price: 22550,
    year: 2023,
    mileage: 0,
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'Fuel Efficient'],
  },
];