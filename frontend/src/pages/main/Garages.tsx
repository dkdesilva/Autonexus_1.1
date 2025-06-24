import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Card from '../../components/main/ui/Card';
import Button from '../../components/main/ui/Button';
import axios from 'axios';
import GarageMap from './garage/GarageMap';

interface Garage {
  garage_id: number;
  name: string;
  service_type: string;
  description: string;
  founded_year: string;
  opening_days: string;
  opening_hours: string;
  user: {
    user_id: number;
    email: string;
    phone_number: string;
    address: string;
    province: string;
    district: string;
    profile_picture: string | null;
    cover_picture: string | null;
  };
}

interface MapGarage {
  garage_id: number;
  garage_name: string;
  description: string;
  lat: number;
  lng: number;
  province: string;
  district: string;
  address: string;
  profile_picture: string | null;
  service_type: string;
}

const Garages: React.FC = () => {
  const [allGarages, setAllGarages] = useState<Garage[]>([]);
  const [filteredGarages, setFilteredGarages] = useState<Garage[]>([]);
  const [mapGarages, setMapGarages] = useState<MapGarage[]>([]);
  const [filteredMapGarages, setFilteredMapGarages] = useState<MapGarage[]>([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/garagesall')
      .then(res => {
        setAllGarages(res.data);
        setFilteredGarages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    axios.get('http://localhost:5000/api/mapgarages')
      .then(res => {
        setMapGarages(res.data);
        setFilteredMapGarages(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleFilter = () => {
    const filtered = allGarages.filter(g =>
      (province === '' || g.user.province === province) &&
      (district === '' || g.user.district === district)
    );
    setFilteredGarages(filtered);

    const mapFiltered = mapGarages.filter(g =>
      (province === '' || g.province === province) &&
      (district === '' || g.district === district)
    );
    setFilteredMapGarages(mapFiltered);
  };

  const resetFilters = () => {
    setProvince('');
    setDistrict('');
    setFilteredGarages(allGarages);
    setFilteredMapGarages(mapGarages);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <h1 className="text-3xl font-bold mb-4">Find Nearby Garages</h1>

        {/* Filter Box */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Province</label>
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            >
              <option value="">All Provinces</option>
              <option value="Western">Western</option>
              <option value="Southern">Southern</option>
              <option value="Central">Central</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">District</label>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-700"
            >
              <option value="">All Districts</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Kandy">Kandy</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              {/* Add more as needed */}
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={resetFilters}>Reset</Button>
            <Button variant="primary" onClick={handleFilter}>Filter</Button>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-10 h-[28rem]">
          <GarageMap garages={filteredMapGarages} />
        </div>

        {/* Garage Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {loading ? (
            <p className="text-center">Loading garages...</p>
          ) : filteredGarages.length === 0 ? (
            <p className="text-center">No garages found for selected filters.</p>
          ) : (
            filteredGarages.map((g, idx) => (
              <Card key={g.garage_id} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={g.user.cover_picture || g.user.profile_picture || 'https://via.placeholder.com/300x200'}
                      alt={g.name}
                      className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{g.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1">4.5</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">{g.service_type}</div>
                    <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" /> {g.user.address}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" /> {g.user.phone_number}
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Button size="sm" variant="primary">Book Service</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Garages;
