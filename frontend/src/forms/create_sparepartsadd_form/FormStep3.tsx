import React, { useRef } from 'react';
import { StepProps } from '../create_sparepartsadd_form/spare-types';
import { ImagePlus } from 'lucide-react';

const FormStep3: React.FC<StepProps> = ({ formData, setFormData, errors, setErrors }) => {
  const fileInputRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, images: 'Please upload only image files' }));
      return;
    }

    const updatedImages = [...formData.images];
    updatedImages[index] = file;

    setFormData((prev) => ({ ...prev, images: updatedImages }));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = undefined as any;

    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const renderImageSlot = (index: number) => (
    <div key={index} className="relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRefs[index]}
        className="hidden"
        onChange={(e) => handleFileChange(e, index)}
      />

      <div className="aspect-square w-full rounded-lg overflow-hidden relative bg-gray-100 dark:bg-gray-700 transition-colors">
        {formData.images[index] ? (
          <>
            <img
              src={URL.createObjectURL(formData.images[index])}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              ×
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRefs[index].current?.click()}
            className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ImagePlus className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Upload Image {index + 1}
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 transition-all duration-300 ease-in-out text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Images</h2>
      <p className="text-gray-600 dark:text-gray-400">Add up to 4 images to your profile.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(renderImageSlot)}
      </div>

      {errors.images && (
        <p className="mt-1 text-sm text-red-500">{errors.images}</p>
      )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Maximum file size: 5MB. Only image files are allowed.
        </p>
    </div>
  );
};

export default FormStep3;
