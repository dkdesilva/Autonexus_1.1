import React, { useState, useRef, useEffect } from 'react';
import { User, Pencil } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000';

interface ProfileImageResponse {
  profile_picture: string;
}

const GarageProfileImageSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        // Step 1: Fetch user info to get user_type
        const userRes = await axios.get(`${API_BASE}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userType = userRes.data.user_type;

        // Step 2: Fetch profile image dynamically using userType
        const response = await axios.get<ProfileImageResponse>(
          `${API_BASE}/api/${userType}/profile-image`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.profile_picture) {
          setSavedImageUrl(`${API_BASE}/images/${response.data.profile_picture}`);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404 || err.response?.data.message === 'Profile image not found') {
            setSavedImageUrl(null);
          } else {
            const message = err.response?.data.message || 'Failed to fetch profile image';
            setError(message);
            toast.error(message);
          }
        } else {
          setError('An unexpected error occurred');
          toast.error('An unexpected error occurred');
        }
      }
    };

    fetchProfileImage();
  }, []);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveClick = async () => {
    if (!selectedFile) {
      toast.error('No file selected');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      const uploadRes = await axios.post(
        `${API_BASE}/api/customer/upload-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { filename } = uploadRes.data;

      await axios.post(
        `${API_BASE}/api/customer/save-profile-image`,
        { filename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSavedImageUrl(`${API_BASE}/images/${filename}`);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('Profile image updated!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message || 'Failed to update profile image');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center -mt-12 mr-6">
      <ToastContainer position="top-right" autoClose={3000} />
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
              onError={() => setSavedImageUrl(null)}
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

      {selectedFile && (
        <button
          onClick={handleSaveClick}
          disabled={loading}
          className={`mt-4 px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            !loading
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Save selected profile image"
          type="button"
        >
          {loading ? 'Saving...' : 'Save Image'}
        </button>
      )}
    </div>
  );
};

export default GarageProfileImageSection;
