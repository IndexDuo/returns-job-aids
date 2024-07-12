// src/components/EmailTemplate.js
import React, { useState } from 'react';

const EmailTemplate = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    trackingNumber: '',
    // other fields
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = () => {
    // validation and copy logic
  };

  return (
    <div>
      <h2>Email Template</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            // Add regex and validation
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            // Add regex and validation
          />
        </label>
        <label>
          Tracking Number:
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            // Add regex and validation
          />
          <span title="Find this on the package">?</span>
        </label>
        {/* Other fields */}
        <button type="button" onClick={handleCopy}>Copy Template</button>
      </form>
    </div>
  );
};

export default EmailTemplate;
