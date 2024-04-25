// src/App.tsx
import React, { useState } from 'react';
import '../App.css';
import InspectionForm, { CarFormData } from './InspectionForm';

function Inspection() {
  const [formData, setFormData] = useState<CarFormData | null>(null);
  const handleSubmit = (data: CarFormData) => {
    // Handle form submission, you can send the data to your backend here
    setFormData(data);
  };

  return (
    <div className="App">
      <h1> SCHEDULE AN INSPECTION AND TESTDRIVE </h1>
      <img src={('./CarInspection.png')} alt="car" height={200} width={500} />
      <InspectionForm onSubmit={handleSubmit} />
      {formData && (
        <div>
          <h2>Submitted Data</h2>
          <p>Make: {formData.make}</p>
          <p>Model: {formData.model}</p>
          <p>Year: {formData.year}</p>
          <p>VIN: {formData.VIN}</p>
          <p>VIN: {formData.Phone}</p>
          <p>Inspection Date: {formData.inspectionDate}</p>
        </div>
      )}
    </div>
  );
}

export default Inspection;
