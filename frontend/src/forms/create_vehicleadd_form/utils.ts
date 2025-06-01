import { FormData, FormErrors } from '../create_vehicleadd_form/types';

export const validateStep = (step: number, formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  switch (step) {
    case 1:
      if (!formData.title.trim()) {
        errors.title = 'Title is required';
      }
      if (!formData.description.trim()) {
        errors.description = 'Description is required';
      }
      if (!formData.price.trim()) {
        errors.price = 'Price is required';
      }
      break;

    case 2:
      if (!formData.province.trim()) {
        errors.province = 'Province is required';
      }
      if (!formData.city.trim()) {
        errors.city = 'City is required';
      }
      if (!formData.selling_status.trim()) {
        errors.selling_status = 'Selling status is required';
      }
      if (!formData.phone_number.trim()) {
        errors.phone_number = 'Phone number is required';
      } else if (!/^[\d\s\(\)\-\+]+$/.test(formData.phone_number)) {
        errors.phone_number = 'Please enter a valid phone number';
      }
      break;

    case 3:
      // NO validation for images as per your request
      break;

    case 4:
      if (!formData.item_type.trim()) {
        errors.item_type = 'Item type is required';
      }
      if (!formData.item_condition.trim()) {
        errors.item_condition = 'Item condition is required';
      }
      if (!formData.brand.trim()) {
        errors.brand = 'Brand is required';
      }
      if (!formData.color.trim()) {
        errors.color = 'Color is required';
      }
      if (!formData.made_year.trim()) {
        errors.made_year = 'Made year is required';
      }
      if (!formData.mileage.trim()) {
        errors.mileage = 'Mileage is required';
      }
      if (!formData.fuel_type.trim()) {
        errors.fuel_type = 'Fuel type is required';
      }
      if (!formData.transmission.trim()) {
        errors.transmission = 'Transmission is required';
      }
      break;
  }

  return errors;
};

export const isStepValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
