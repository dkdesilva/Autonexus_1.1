import React, { useState } from 'react';
import axios from 'axios';
import type { FormData, FormErrors } from '../create_vehicleadd_form/types';
import ProgressBar from './ProgressBar';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import { validateStep, isStepValid } from '../create_vehicleadd_form/utils';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const VehicleAddMultiStepForm: React.FC = () => {
  const totalSteps = 4;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    province: '',
    city: '',
    phone_number: '',
    selling_status: '',
    images: [],
    item_type: '',
    item_condition: '',
    brand: '',
    color: '',
    made_year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const goToNextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    if (isStepValid(stepErrors) && currentStep < totalSteps) {
      setErrors({});
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    if (!isStepValid(stepErrors)) return;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach(file => form.append('images', file));
        } else {
          form.append(key, value);
        }
      });

      const response = await axios.post(
        'http://localhost:5000/api/vehicle/add',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response:', response.data);
      toast.success('Vehicle submitted successfully!');

      setTimeout(() => {
        setIsComplete(true);
      }, 2000); // Wait 2 seconds before switching screen

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormStep = () => {
    const stepProps = { formData, setFormData, errors, setErrors };
    switch (currentStep) {
      case 1: return <FormStep1 {...stepProps} />;
      case 2: return <FormStep2 {...stepProps} />;
      case 3: return <FormStep3 {...stepProps} />;
      case 4: return <FormStep4 {...stepProps} />;
      default: return null;
    }
  };

if (isComplete) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Listing Submitted!
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Your vehicle listing has been added.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Another
          </button>
          <button
            onClick={() => navigate('/customer-profile')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <form onSubmit={handleSubmit}>
          {renderFormStep()}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleAddMultiStepForm;
