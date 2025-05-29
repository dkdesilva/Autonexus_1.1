import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  cus_id?: number;
  user_id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
  gender: string;
  customer_created_at?: string;
  email: string;
  user_type?: string;
  phone_number: string;
  address: string;
  province: string;
  district: string;
  user_created_at?: string;
  username?: string;
}

const animationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative border-t mt-8 mb-4">
    <span className="absolute -top-3 left-3 bg-white dark:bg-gray-800 px-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
      {title}
    </span>
  </div>
);

const DealershipProfileFormSection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    document.title = "AutoNexus - Your Profile";
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login.");
      setAuthToken(null);
      setLoading(false);
      navigate("/signin");
      return;
    }

    setAuthToken(token);

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/customer/details");
        setProfile(res.data);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setAuthToken(null);
          navigate("/signin");
        } else if (err.response?.status === 404) {
          setError("No customer details found.");
          setLoading(false);
        } else {
          setError("Failed to fetch profile data.");
          setLoading(false);
        }
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
      birthday: formData.get("date_of_birth"),
      gender: formData.get("gender"),
      phone_number: formData.get("phone_number"),
      address: formData.get("address"),
      province: formData.get("province"),
      district: formData.get("district"),
    };

    try {
      const res = await axios.put(
        "http://localhost:5000/api/customer/update-profile",
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
        <SectionHeader title="Personal Information" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup label="Email">
            <input
              type="email"
              name="email"
              defaultValue={profile?.email}
              disabled
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="First Name">
            <input
              type="text"
              name="first_name"
              defaultValue={profile?.first_name || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Middle Name">
            <input
              type="text"
              name="middle_name"
              defaultValue={profile?.middle_name || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Last Name">
            <input
              type="text"
              name="last_name"
              defaultValue={profile?.last_name || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Date of Birth">
            <input
              type="date"
              name="date_of_birth"
              defaultValue={profile?.birthday ? profile.birthday.split("T")[0] : ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Phone Number">
            <input
              type="text"
              name="phone_number"
              defaultValue={profile?.phone_number || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Gender">
            <select
              name="gender"
              defaultValue={profile?.gender || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormGroup>
          <FormGroup label="Address">
            <input
              type="text"
              name="address"
              defaultValue={profile?.address || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="Province">
            <input
              type="text"
              name="province"
              defaultValue={profile?.province || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
          <FormGroup label="District">
            <input
              type="text"
              name="district"
              defaultValue={profile?.district || ""}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </FormGroup>
        </div>

        <div className="flex justify-end mt-4">
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

export default DealershipProfileFormSection;
