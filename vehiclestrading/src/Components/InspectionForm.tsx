// src/components/InspectionForm.tsx
import React, { useState } from 'react';

export interface CarFormData {
  make: string;
  model: string;
  year: string;
  VIN: string;
  Phone: string;
  inspectionDate: string;
}

interface InspectionFormProps {
  onSubmit: (data: CarFormData) => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ onSubmit }) => {
  const [carData, setCarData] = useState<CarFormData>({
    make: '',
    model: '',
    year: '',
    VIN: '',
    Phone: '',
    inspectionDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(carData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Make:
        <input type="text" name="make" value={carData.make} onChange={handleChange} />
      </label>
      <label>
        Model:
        <input type="text" name="model" value={carData.model} onChange={handleChange} />
      </label>
      <label>
        Year:
        <input type="text" name="year" value={carData.year} onChange={handleChange} />
      </label>
      <label>
        VIN:
        <input type="text" name="VIN" value={carData.VIN} onChange={handleChange} />
      </label>
      <label>
        Inspection Date:
        <input type="date" name="inspectionDate" value={carData.inspectionDate} onChange={handleChange} />
      </label>
      <label>
        Buyer's phone:
        <input type="text" name="BuyerPhone" value={carData.Phone} onChange={handleChange} />
      </label>
      <button type="submit">Schedule Inspection</button>
    </form>
  );
};

export default InspectionForm;
