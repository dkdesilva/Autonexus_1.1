// Represents all input data from the spare parts form
export interface FormData {
  title: string;
  description: string;
  price: string;
  province: string;
  city: string;
  phone_number: string;
  selling_status: string;
  images: File[];
  item_type: string;
  item_condition: string;
  brand: string;
  color: string;
  made_year: string;
  material: string;
  model_compatibility: string;
  quantity: string;
}

// Represents potential validation errors for each form field
export interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  province?: string;
  city?: string;
  phone_number?: string;
  selling_status?: string;
  images?: string;
  item_type?: string;
  item_condition?: string;
  brand?: string;
  color?: string;
  made_year?: string;
  material?: string;
  model_compatibility?: string;
  quantity?: string;
}

// Props passed to each form step
export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}
