import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/main/layout/Navbar';
import Footer from '../../components/main/layout/Footer';
import Button from '../../components/main/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Seller {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  province: string;
  district: string;
  profile_picture: string | null;
  cover_picture: string | null;
}

const CustomerSellerDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const fromDetailsId = location.state?.fromDetailsId;

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/seller/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSeller(data);
      } catch (err) {
        console.error('Error fetching seller:', err);
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-white">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Seller Not Found</h2>
          <Link to="/home">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white pt-24">
        <div className="max-w-5xl mx-auto  px-4 pb-24">
          <div className="bg-gray-800 rounded-3xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  {seller.profile_picture ? (
                    <img
                      src={seller.profile_picture}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-500"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold">
                      {seller.full_name.charAt(0)}
                    </div>
                  )}
                  {/* Edit Icon */}
                  <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Seller Info */}
                <div>
                  <h2 className="text-2xl font-semibold">{seller.full_name}</h2>
                  <p className="text-sm text-gray-400">Member since 2025</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-gray-400" />
                  {seller.email}
              </p>
              <p className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-gray-400" />
                  {seller.phone_number}
              </p>
              <p className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <strong>Address:</strong>&nbsp; {seller.address}
              </p>
              <p className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <strong>Province:</strong>&nbsp; {seller.province}
              </p>
              <p className="flex items-center md:col-span-2">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <strong>District:</strong>&nbsp; {seller.district}
              </p>
              </div>


            {/* Back Button */}
            <div className="mt-10 text-right">
              {fromDetailsId ? (
              <Button variant="outline" onClick={() => navigate(`/details/${fromDetailsId}`)}>
                  Back to Details
              </Button>
              ) : null}

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CustomerSellerDetails;
