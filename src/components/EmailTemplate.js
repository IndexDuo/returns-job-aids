// src/components/EmailTemplate.js
import React, { useState, useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'js-cookie';

const EmailTemplate = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    trackingNumber: '',
  });

  const [copied, setCopied] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const trackingNumberRef = useRef(null);

  useEffect(() => {
    // Load data from cookies if available
    const savedData = Cookies.get('userInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleBlur = (field) => {
    let value = formData[field];
    if (field === 'phone') {
      // Apply phone number formatting
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'); // Format as (123) 456-7890
    }
    setFormData({ ...formData, [field]: value });
    Cookies.set('userInfo', JSON.stringify({ ...formData, [field]: value }), { expires: 0.375 });
  };

  const handleInput = (e, field) => {
    setFormData({ ...formData, [field]: e.target.innerText });
  };

  const handleCopy = () => {
    setCopied(true);
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
      <div>
        <p>Dear [Customer],</p>
        <p>
          My name is <span
            ref={nameRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleInput(e, 'name')}
            onBlur={() => handleBlur('name')}
          >
            {formData.name}
          </span>.
          I am contacting you regarding the return of the item with the tracking number <span
            ref={trackingNumberRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleInput(e, 'trackingNumber')}
            onBlur={() => handleBlur('trackingNumber')}
          >
            {formData.trackingNumber}
          </span>.
          Please contact me at <span
            ref={phoneRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleInput(e, 'phone')}
            onBlur={() => handleBlur('phone')}
          >
            {formData.phone}
          </span> if you need any further information.
        </p>
        <p>Thank you,<br />
          <span>{formData.name}</span>
        </p>
      </div>
      <CopyToClipboard text={template} onCopy={handleCopy}>
        <button type="button">Copy Template</button>
      </CopyToClipboard>
      {copied && <span style={{ color: 'green' }}>Copied!</span>}
      <h3>Preview</h3>
      <pre>{template}</pre>
    </div>
  );
};

export default EmailTemplate;
