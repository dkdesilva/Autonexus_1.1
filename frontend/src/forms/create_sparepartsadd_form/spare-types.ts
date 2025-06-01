export interface FormData {
  title: string;
  description: string;
  price: string;
  province: string;
  city: string;
  images: File[];
  selling_status: string;
  phone_number: string;
  item_type: string;
  item_condition: string;
  brand: string;
  color: string;
  made_year: string;
  model_compatibility: string;
  quantity: string;
  material: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  province?: string;
  city?: string;
  images?: string;
  selling_status?: string;
  phone_number?: string;
  item_type?: string;
  item_condition?: string;
  brand?: string;
  color?: string;
  made_year?: string;
  model_compatibility?: string;
  quantity?: string;
  material?: string;
}

export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: FormErrors;
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}
