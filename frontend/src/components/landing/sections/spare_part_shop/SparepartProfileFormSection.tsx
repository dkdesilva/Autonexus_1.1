import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface DealershipProfile {
  phone_number: string;
  address: string;
  province: string;
  district: string;
  company_name: string;
  description: string;
  founded_year: string;
  owner_name: string;
  opening_days: string;
  opening_hours: string;
}

const animationProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const openingHoursOptions = [
  "8:00 AM – 6:00 PM",
  "8:00 AM – 2:00 PM",
  "8:00 AM – 12:00 PM",
  "7:00 AM – 9:00 PM",
];

const openingDaysOptions = [
  "7 Days (Mon–Sun)",
  "6 Days (Mon–Sat)",
  "5 Days (Mon–Fri)",
  "Weekends Only",
];

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
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

const SparepartProfileFormSection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [profile, setProfile] = useState<DealershipProfile | null>(null);
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
    document.title = "AutoNexus - Dealership Profile";
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("No token found. Please login.");
      setAuthToken(null);
      setLoading(false);
      navigate("/signin");
      return;
    }

    setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/spareparts/details");
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
          setError("No dealership profile found.");
          setLoading(false);
        } else {
          setError("Failed to fetch profile data.");
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const payload = {
      phone_number: formData.get("phone_number"),
      address: formData.get("address"),
      province: formData.get("province"),
      district: formData.get("district"),
      company_name: formData.get("company_name"),
      description: formData.get("description"),
      founded_year: formData.get("founded_year"),
      owner_name: formData.get("owner_name"),
      opening_days: formData.get("opening_days"),
      opening_hours: formData.get("opening_hours"),
    };

    try {
      const res = await axios.put("http://localhost:5000/api/spareparts/update-profile", payload);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <>
      <motion.div key="dealership-settings" {...animationProps}>
        <h2 className="text-xl font-semibold mb-6">Dealership Profile Settings</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <SectionHeader title="Dealership Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Phone Number">
              <input type="text" name="phone_number" defaultValue={profile?.phone_number || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Address">
              <input type="text" name="address" defaultValue={profile?.address || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Province">
              <input type="text" name="province" defaultValue={profile?.province || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="District">
              <input type="text" name="district" defaultValue={profile?.district || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Company Name">
              <input type="text" name="company_name" defaultValue={profile?.company_name || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Description">
              <textarea name="description" defaultValue={profile?.description || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} />
            </FormGroup>
            <FormGroup label="Founded Year">
              <input type="text" name="founded_year" defaultValue={profile?.founded_year || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Owner Name">
              <input type="text" name="owner_name" defaultValue={profile?.owner_name || ""} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </FormGroup>
            <FormGroup label="Opening Days">
              <select name="opening_days" defaultValue={profile?.opening_days} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {openingDaysOptions.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="Opening Hours">
              <select name="opening_hours" defaultValue={profile?.opening_hours} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {openingHoursOptions.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </FormGroup>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                 // theme="colored"
                />
    </>
  );
};

export default SparepartProfileFormSection;
