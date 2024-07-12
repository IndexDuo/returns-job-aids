// src/components/EmailTemplate.js
import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'js-cookie';

const EmailTemplate = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    trackingNumber: '',
    // other fields if needed
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load data from cookies if available
    const savedData = Cookies.get('userInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopy = () => {
    setCopied(true);
    // Save data to cookies
    Cookies.set('userInfo', JSON.stringify(formData), { expires: 0.375 }); // 9 hours
  };

  const template = `
    Dear [Customer],

    My name is ${formData.name}. I am contacting you regarding the return of the item with the tracking number ${formData.trackingNumber}. Please contact me at ${formData.phone} if you need any further information.

    Thank you,
    ${formData.name}
  `;

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
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Tracking Number:
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
          />
          <span title="Find this on the package">?</span>
        </label>
        <br />
        <CopyToClipboard text={template} onCopy={handleCopy}>
          <button type="button">Copy Template</button>
        </CopyToClipboard>
        {copied && <span style={{ color: 'green' }}>Copied!</span>}
      </form>
      <h3>Preview</h3>
      <pre>{template}</pre>
    </div>
  );
};

export default EmailTemplate;
