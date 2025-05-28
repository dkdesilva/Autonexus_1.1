import { Car, Truck, Recycle as Motorcycle, GalleryVerticalEnd, Wrench, Building2, ShieldCheck } from 'lucide-react';

// Vehicles Data
export const vehicles = [
  {
    id: 1,
    title: '2022 Tesla Model 3 Long Range',
    price: 48990,
    type: 'electric',
    brand: 'Tesla',
    year: 2022,
    mileage: 12000,
    location: 'San Francisco, CA',
    condition: 'Excellent',
    description: 'This Model 3 Long Range is in pristine condition with only 12,000 miles. Features include Autopilot, premium sound system, and white interior.',
    images: [
      'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/11413785/pexels-photo-11413785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12318242/pexels-photo-12318242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/9553904/pexels-photo-9553904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Electric Motors Inc.',
      rating: 4.9,
      verified: true
    }
  },
  {
    id: 2,
    title: '2021 Ford F-150 Raptor',
    price: 69500,
    type: 'truck',
    brand: 'Ford',
    year: 2021,
    mileage: 18500,
    location: 'Denver, CO',
    condition: 'Good',
    description: 'Ford F-150 Raptor with the 3.5L EcoBoost V6 engine, Fox racing shocks, and all-terrain capabilities. Perfect for off-road adventures.',
    images: [
      'https://images.pexels.com/photos/5214419/pexels-photo-5214419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/9043712/pexels-photo-9043712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/14547174/pexels-photo-14547174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4933769/pexels-photo-4933769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Mountain View Ford',
      rating: 4.7,
      verified: true
    }
  },
  {
    id: 3,
    title: '2023 BMW M4 Competition',
    price: 82900,
    type: 'sports',
    brand: 'BMW',
    year: 2023,
    mileage: 5000,
    location: 'Miami, FL',
    condition: 'Excellent',
    description: 'This M4 Competition features a 503-hp twin-turbo inline-six engine, carbon fiber accents, and premium leather interior. A true driver\'s car.',
    images: [
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/358189/pexels-photo-358189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3954435/pexels-photo-3954435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Luxury Automobile Group',
      rating: 4.8,
      verified: true
    }
  },
  {
    id: 4,
    title: '2020 Toyota RAV4 Hybrid',
    price: 32500,
    type: 'suv',
    brand: 'Toyota',
    year: 2020,
    mileage: 28000,
    location: 'Seattle, WA',
    condition: 'Good',
    description: 'Fuel-efficient RAV4 Hybrid with all-wheel drive, advanced safety features, and spacious interior. Perfect family SUV with excellent reliability.',
    images: [
      'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Northwest Toyota',
      rating: 4.6,
      verified: true
    }
  },
  {
    id: 5,
    title: '2019 Porsche 911 Carrera S',
    price: 118000,
    type: 'sports',
    brand: 'Porsche',
    year: 2019,
    mileage: 15000,
    location: 'Los Angeles, CA',
    condition: 'Excellent',
    description: 'Classic 911 design with modern performance. This Carrera S features a twin-turbo flat-six engine, Sport Chrono package, and premium audio system.',
    images: [
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Premium Auto Collection',
      rating: 4.9,
      verified: true
    }
  },
  {
    id: 6,
    title: '2021 Honda Civic Type R',
    price: 39900,
    type: 'hatchback',
    brand: 'Honda',
    year: 2021,
    mileage: 22000,
    location: 'Chicago, IL',
    condition: 'Good',
    description: 'Performance-oriented Civic Type R with 306-hp turbocharged engine, 6-speed manual transmission, and aggressive styling. A true hot hatch.',
    images: [
      'https://images.pexels.com/photos/1213294/pexels-photo-1213294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1429775/pexels-photo-1429775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Midwest Honda',
      rating: 4.7,
      verified: true
    }
  }
];

// Spare Parts Data
export const spareParts = [
  {
    id: 101,
    title: 'Bosch Oxygen Sensor',
    price: 79.99,
    category: 'Engine',
    compatible: ['Toyota', 'Honda', 'Ford', 'Chevrolet'],
    condition: 'New',
    warranty: '2 years',
    description: 'Universal oxygen sensor for most Japanese and American vehicles. Improves fuel efficiency and reduces emissions.',
    images: [
      'https://images.pexels.com/photos/3819760/pexels-photo-3819760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5525661/pexels-photo-5525661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3846155/pexels-photo-3846155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'AutoParts Pro',
      rating: 4.8,
      verified: true
    }
  },
  {
    id: 102,
    title: 'Brembo Brake Kit',
    price: 299.99,
    category: 'Brakes',
    compatible: ['BMW', 'Audi', 'Mercedes'],
    condition: 'New',
    warranty: '3 years',
    description: 'High-performance brake kit including rotors and pads. Provides superior stopping power and heat dissipation.',
    images: [
      'https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4480524/pexels-photo-4480524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12062851/pexels-photo-12062851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4480513/pexels-photo-4480513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Performance Parts Inc.',
      rating: 4.9,
      verified: true
    }
  },
  {
    id: 103,
    title: 'K&N Air Filter',
    price: 59.99,
    category: 'Engine',
    compatible: ['All makes and models'],
    condition: 'New',
    warranty: 'Million Mile Limited Warranty',
    description: 'High-flow air filter designed to increase horsepower and acceleration. Washable and reusable.',
    images: [
      'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3807381/pexels-photo-3807381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4906367/pexels-photo-4906367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4906383/pexels-photo-4906383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'TurboMods',
      rating: 4.7,
      verified: true
    }
  },
  {
    id: 104,
    title: 'Bilstein Shock Absorbers (Set of 4)',
    price: 589.99,
    category: 'Suspension',
    compatible: ['Toyota 4Runner', 'Jeep Wrangler', 'Ford F-150'],
    condition: 'New',
    warranty: 'Limited Lifetime',
    description: 'Heavy-duty monotube shock absorbers designed for off-road performance. Provides improved handling and comfort on any terrain.',
    images: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3799368/pexels-photo-3799368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3822434/pexels-photo-3822434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    seller: {
      name: 'Off-Road Outfitters',
      rating: 4.8,
      verified: true
    }
  }
];

// Garages Data
export const garages = [
  {
    id: 201,
    name: 'Precision Auto Works',
    rating: 4.8,
    specialties: ['European Cars', 'Performance Tuning', 'Diagnostics'],
    location: {
      address: '789 Mechanic Street, Portland, OR',
      coordinates: { lat: 45.523064, lng: -122.676483 }
    },
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
    certified: ['BMW', 'Mercedes', 'Audi'],
    contact: {
      phone: '(503) 555-1234',
      email: 'service@precisionauto.com'
    },
    description: 'Specializing in European vehicles with factory-trained technicians using the latest diagnostic equipment.',
    images: [
      'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3807331/pexels-photo-3807331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 202,
    name: 'Quick Lube & Tire',
    rating: 4.6,
    specialties: ['Oil Changes', 'Tire Services', 'Brake Repairs'],
    location: {
      address: '456 Service Road, Austin, TX',
      coordinates: { lat: 30.267153, lng: -97.743057 }
    },
    hours: 'Mon-Sat: 7AM-7PM, Sun: 9AM-5PM',
    certified: ['General Service'],
    contact: {
      phone: '(512) 555-7890',
      email: 'info@quicklube.com'
    },
    description: 'Fast, affordable maintenance services with no appointment necessary. Most services completed in 30 minutes or less.',
    images: [
      'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4489742/pexels-photo-4489742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 203,
    name: 'Elite Auto Body & Collision',
    rating: 4.9,
    specialties: ['Collision Repair', 'Paint Services', 'Dent Removal'],
    location: {
      address: '321 Bodyshop Lane, Atlanta, GA',
      coordinates: { lat: 33.749000, lng: -84.387980 }
    },
    hours: 'Mon-Fri: 8AM-6PM',
    certified: ['I-CAR Gold', 'ASE Certified'],
    contact: {
      phone: '(404) 555-4321',
      email: 'repairs@eliteautobody.com'
    },
    description: 'Premier collision repair facility with state-of-the-art equipment and a lifetime warranty on all repairs.',
    images: [
      'https://images.pexels.com/photos/4480531/pexels-photo-4480531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4480537/pexels-photo-4480537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
];

// Dealerships Data
export const dealerships = [
  {
    id: 301,
    name: 'Premier Auto Group',
    rating: 4.7,
    brands: ['BMW', 'Mercedes-Benz', 'Audi'],
    location: {
      address: '123 Luxury Lane, Beverly Hills, CA',
      coordinates: { lat: 34.073620, lng: -118.400352 }
    },
    hours: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
    verified: true,
    contact: {
      phone: '(310) 555-9876',
      email: 'sales@premierautogroup.com'
    },
    description: 'Luxury vehicle dealership offering an exceptional buying experience with a wide selection of premium vehicles.',
    inventoryCount: 87,
    images: [
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4800192/pexels-photo-4800192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 302,
    name: 'Hometown Motors',
    rating: 4.5,
    brands: ['Ford', 'Chevrolet', 'GMC'],
    location: {
      address: '456 Main Street, Springfield, IL',
      coordinates: { lat: 39.781721, lng: -89.650148 }
    },
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    verified: true,
    contact: {
      phone: '(217) 555-1234',
      email: 'info@hometownmotors.com'
    },
    description: 'Family-owned dealership serving the community for over 40 years with honest pricing and exceptional service.',
    inventoryCount: 124,
    images: [
      'https://images.pexels.com/photos/4705896/pexels-photo-4705896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4552167/pexels-photo-4552167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  },
  {
    id: 303,
    name: 'EcoDrive Hybrids',
    rating: 4.8,
    brands: ['Toyota', 'Honda', 'Hyundai'],
    location: {
      address: '789 Green Avenue, Portland, OR',
      coordinates: { lat: 45.523064, lng: -122.676483 }
    },
    hours: 'Mon-Sat: 10AM-7PM',
    verified: true,
    contact: {
      phone: '(503) 555-7890',
      email: 'sales@ecodriveautos.com'
    },
    description: 'Specializing in hybrid and electric vehicles with expert knowledge on eco-friendly automotive technology.',
    inventoryCount: 63,
    images: [
      'https://images.pexels.com/photos/3849557/pexels-photo-3849557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ]
  }
];

// Service Cards Data
export const serviceCards = [
  {
    id: 1,
    title: 'Buy & Sell Vehicles',
    description: 'Find your perfect ride or sell your vehicle quickly and securely.',
    icon: <Car className="h-10 w-10 text-blue-600" />,
    link: '/vehicles'
  },
  {
    id: 2,
    title: 'Locate Garages',
    description: 'Discover trusted repair shops and service centers near you.',
    icon: <Wrench className="h-10 w-10 text-blue-600" />,
    link: '/garages'
  },
  {
    id: 3,
    title: 'Spare Parts',
    description: 'Browse thousands of parts for any make and model.',
    icon: <GalleryVerticalEnd className="h-10 w-10 text-blue-600" />,
    link: '/spare-parts'
  },
  {
    id: 4,
    title: 'Virtual Dealerships',
    description: 'Explore dealership inventories and services from anywhere.',
    icon: <Building2 className="h-10 w-10 text-blue-600" />,
    link: '/dealerships'
  }
];

// Get Started Options
export const getStartedOptions = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Looking to buy or sell vehicles and parts',
    icon: <Car className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-200" />,
    link: '/customer-signup',
  },
  {
    id: 'parts',
    title: 'Spare Parts Shop',
    description: 'Sell automotive parts and accessories',
    icon: <GalleryVerticalEnd className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-200" />,
    link: '/sparepart-signup',
  },
  {
    id: 'shop',
    title: 'Vehicle Shop',
    description: 'List and sell vehicles in your inventory',
    icon: <Truck className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-200" />,
    link: '/vehicleshop-signup',
  },
  {
    id: 'dealership',
    title: 'Dealership',
    description: 'Comprehensive dealership services',
    icon: <Building2 className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-200" />,
    link: '/vehicledealer-signup',
  },
];