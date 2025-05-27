import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SignupFormProps {
  selectedRole: string | null;
  onLoginClick: () => void;
  onSuccess: () => void;
  onSignup: (name: string, email: string, password: string, role: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  selectedRole,
  onLoginClick,
  onSuccess,
  onSignup,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSignup(formData.name, formData.email, formData.password, selectedRole || 'customer');
      onSuccess();
    }
  };

  const getRoleName = () => {
    switch (selectedRole) {
      case 'customer':
        return 'Customer';
      case 'parts':
        return 'Spare Part Shop';
      case 'dealer':
        return 'Vehicle Dealership';
      case 'garage':
        return 'Garage';
      default:
        return 'User';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {selectedRole && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
          <p className="text-primary-700 dark:text-primary-300">
            Signing up as <strong>{getRoleName()}</strong>
          </p>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        fullWidth
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        fullWidth
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        fullWidth
      />

      <Button type="submit" fullWidth className="mt-2">
        Create Account
      </Button>

      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;
