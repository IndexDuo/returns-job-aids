import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Cookies from "js-cookie";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

const EmailTemplate = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    trackingNumber: "",
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // saved data should be agentInfo, which is their first and last name
    const savedData = Cookies.get("agentInfo");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleBlur = (field) => {
    let value = formData[field];
    if (field === "phone") {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    setFormData({ ...formData, [field]: value });
    // cookies does not need to be saved for form data.
    // Cookies.set('userInfo', JSON.stringify({ ...formData, [field]: value }), { expires: 0.375 });
  };

  const handleInput = (e, field) => {
    setFormData({ [field]: e.target.innerText, ...formData });
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const template = `
Dear [Customer],

My name is ${formData.name}. I am contacting you regarding the return of the item with the tracking number ${formData.trackingNumber}. Please contact me at ${formData.phone} if you need any further information.

Thank you,
${formData.name}
  `;

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <h2 className="mb-4">Email Template</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Template:</Form.Label>
              <div className="border p-3 rounded">
                <p>Dear [Customer],</p>
                <p>
                  My name is{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "name")}
                    onBlur={() => handleBlur("name")}
                    dangerouslySetInnerHTML={{ __html: formData.name }}
                    className="text-primary"
                  ></span>
                  . I am contacting you regarding the return of the item with
                  the tracking number{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "trackingNumber")}
                    onBlur={() => handleBlur("trackingNumber")}
                    dangerouslySetInnerHTML={{
                      __html: formData.trackingNumber,
                    }}
                    className="text-primary"
                  ></span>
                  . Please contact me at{" "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => handleInput(e, "phone")}
                    onBlur={() => handleBlur("phone")}
                    dangerouslySetInnerHTML={{ __html: formData.phone }}
                    className="text-primary"
                  ></span>{" "}
                  if you need any further information.
                </p>
                <p>
                  Thank you,
                  <br />
                  <span>{formData.name}</span>
                </p>
              </div>
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <CopyToClipboard text={template} onCopy={handleCopy}>
                <Button variant="primary">Copy Template</Button>
              </CopyToClipboard>
              {copied && (
                <Alert variant="success" className="m-0 py-1">
                  Copied!
                </Alert>
              )}
            </div>
            <Form.Group>
              <Form.Label>Preview:</Form.Label>
              <Form.Control as="textarea" rows={6} value={template} readOnly />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailTemplate;
