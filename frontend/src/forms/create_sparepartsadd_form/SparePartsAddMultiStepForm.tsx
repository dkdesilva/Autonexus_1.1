import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { FormData, FormErrors } from '../create_sparepartsadd_form/spare-types';

import ProgressBar from './ProgressBar';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';

import { validateStep, isStepValid } from '../create_sparepartsadd_form/spare-utils';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SparePartsAddMultiStepForm: React.FC = () => {
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
    material: '',
    model_compatibility: '',
    quantity: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 4;

  const goToNextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    if (isStepValid(stepErrors) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    if (!isStepValid(stepErrors)) return;

    try {
      setIsSubmitting(true);

      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file) => submissionData.append('images', file));
        } else {
          submissionData.append(key, value);
        }
      });

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        toast.error('No token found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/sparepart/add',
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response:', response.data);
      toast.success('Spare part submitted successfully!');

      setTimeout(() => {
        setIsComplete(true);
      }, 2000); // Delay success screen by 2 seconds

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit spare part.');
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
            Your spare part listing has been added.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Another
            </button>
            <button
              onClick={() => {
                toast.success('Vehicle added!');
                setTimeout(() => {
                  navigate('/sparepart-profile');
                }, 500);
              }}
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
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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

export default SparePartsAddMultiStepForm;
