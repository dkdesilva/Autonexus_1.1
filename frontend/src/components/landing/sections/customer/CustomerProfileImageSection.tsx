import React, { useState, useRef, useEffect } from 'react';
import { User, Pencil } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

interface ProfileImageResponse {
  profile_picture: string;
}

const CustomerProfileImageSection: React.FC = () => {
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

        const response = await axios.get<ProfileImageResponse>(
          `${API_BASE}/api/customer/profile-image`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.profile_picture) {
          setSavedImageUrl(`${API_BASE}/images/${response.data.profile_picture}`);
        }
      } catch (err) {
  if (axios.isAxiosError(err)) {
    // Ignore if profile image not found (e.g. 404 or specific message)
    if (err.response?.status === 404 || err.response?.data.message === 'Profile image not found') {
      // Do NOT set an error here because no image is expected for new users
      setSavedImageUrl(null);
    } else {
      setError(err.response?.data.message || 'Failed to fetch profile image');
    }
  } else {
    setError('An unexpected error occurred');
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
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSaveClick = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Step 1: Upload the image file
      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      const uploadResponse = await axios.post(
        `${API_BASE}/api/customer/upload-profile-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Step 2: Save the filename to database
      const { filename } = uploadResponse.data;
      const saveResponse = await axios.post(
        `${API_BASE}/api/customer/save-profile-image`,
        { filename },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the displayed image
      setSavedImageUrl(`${API_BASE}/images/${filename}`);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Failed to update profile image');
      } else {
        setError('An unexpected error occurred');
      }
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
              onError={() => setSavedImageUrl(null)} // Fallback if image fails to load
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
          className={`mt-4 px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-400
            ${
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

      {error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 max-w-xs text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomerProfileImageSection;