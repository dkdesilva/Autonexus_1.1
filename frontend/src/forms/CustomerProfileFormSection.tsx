import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  province: string;
  district: string;
  postal_code: string;
  created_at: string;
}

const animationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const CustomerProfileFormSection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Set or remove axios Authorization header globally
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    document.title = "AutoNexus - Your Profile";

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login.");
      setAuthToken(null);
      setLoading(false);
      // Optionally redirect to login page
      navigate("/signin");
      return;
    }

    setAuthToken(token);

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/customer/get/fullprofile");

        setProfile(res.data);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Unauthorized. Please login again.");
          // Clear token on unauthorized
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setAuthToken(null);
          // Redirect to login
          navigate("/signin");
        } else {
          setError("Failed to fetch profile data.");
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const payload = {
      first_name: formData.get("first_name"),
      middle_name: formData.get("middle_name"),
      last_name: formData.get("last_name"),
      date_of_birth: formData.get("date_of_birth"),
      phone_number: formData.get("phone_number"),
      gender: formData.get("gender"),
      address: formData.get("address"),
      province: formData.get("province"),
      district: formData.get("district"),
      postal_code: formData.get("postal_code"),
    };

    try {
      const res = await axios.put(
        "http://localhost:5000/api/customer/update/details",
        payload
      );
      alert(res.data.message);
    } catch (err) {
      console.error("Update failed", err);
      alert("Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center p-4">
        {error}
      </p>
    );

  return (
    <motion.div key="settings" {...animationProps}>
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.username}
              disabled
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.email}
              disabled
            />
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h3 className="text-lg font-medium mb-3">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.first_name}
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.middle_name}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.last_name}
            />
            <input
              type="date"
              name="date_of_birth"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.date_of_birth?.split("T")[0]}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.phone_number}
            />
            <select
              name="gender"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.gender || ""}
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.address}
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.province}
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.district}
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              defaultValue={profile?.postal_code}
            />
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CustomerProfileFormSection;
