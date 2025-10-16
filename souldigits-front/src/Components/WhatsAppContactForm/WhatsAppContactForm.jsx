import React from 'react';
import './WhatsAppContactForm.css';

function WhatsAppContactForm() {
  // Replace this with your actual WhatsApp number.
  const phoneNumber = '1234567890';
  const message = encodeURIComponent(
    'Hello, I found your website and I am interested in learning more about your services.'
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      Chat on WhatsApp
    </a>
  );
}

export default WhatsAppContactForm;