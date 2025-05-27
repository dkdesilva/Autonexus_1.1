import React, { useState, useRef, useEffect } from 'react';
import { User, Pencil } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // adjust if needed

const CustomerProfileImageSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get token from either storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    // Set global axios header once here
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch saved profile image
    axios
      .get(`${API_BASE}/api/customer/profile-image`)
      .then((res) => {
        setSavedImageUrl(`${API_BASE}/images/${res.data.profile_picture}`);
      })
      .catch(() => {
        setSavedImageUrl(null);
      });
  }, []);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSaveClick = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      // Upload image with axios (header already set)
      const uploadRes = await axios.post(
        `${API_BASE}/api/customer/upload-profile-image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const { filename } = uploadRes.data;

      // Save filename in DB
      await axios.post(
        `${API_BASE}/api/customer/save-profile-image`,
        { filename },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSavedImageUrl(`${API_BASE}/images/${filename}`);
      setSelectedFile(null);
      setPreviewUrl(null);
      alert('Profile image updated!');
    } catch (error) {
      alert('Error saving profile image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center -mt-12 mr-6">
      <div className="relative rounded-full bg-white dark:bg-gray-700 p-1 inline-block">
        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-28 h-28 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : savedImageUrl ? (
            <img
              src={savedImageUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User size={48} className="text-blue-600 dark:text-blue-400" />
          )}
        </div>

        <button
          onClick={handleIconClick}
          aria-label="Choose profile image"
          className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1 w-8 h-8 flex items-center justify-center shadow-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
          type="button"
        >
          <Pencil size={16} className="text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleSaveClick}
        disabled={!selectedFile || loading}
        className={`mt-4 px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-400
          ${
            selectedFile && !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        aria-label="Save selected profile image"
        type="button"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default CustomerProfileImageSection;
