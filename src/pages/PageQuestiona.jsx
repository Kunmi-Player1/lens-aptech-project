import React, { useState } from "react";

const PageQuestiona = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What types of eyewear do you specialize in?",
      answer: "We specialize in a wide range of eyewear including prescription glasses, sunglasses, reading glasses, blue light blocking glasses, and specialty lenses. Our collection features both classic and contemporary designs from leading brands."
    },
    {
      question: "How do I choose the right frame for my face shape?",
      answer: "Our expert stylists can help you find the perfect frame for your face shape. Generally, round faces suit angular frames, square faces suit round or oval frames, oval faces can wear most styles, and heart-shaped faces look great with cat-eye or rimless frames."
    },
    {
      question: "Do you offer prescription lens services?",
      answer: "Yes, we offer comprehensive prescription lens services. We can fit your existing prescription into our frames or provide a complete eye exam through our partner optometrists. We work with single vision, bifocal, and progressive lenses."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return and exchange policy on all unworn eyewear with original packaging. Prescription lenses can be exchanged if the prescription is incorrect. Custom orders and special lenses may have different return conditions."
    },
    {
      question: "How long does it take to receive my glasses?",
      answer: "Standard orders typically take 7-10 business days. Prescription glasses may take 10-14 business days depending on lens complexity. Express shipping options are available for an additional fee."
    },
    {
      question: "Do you offer blue light filtering lenses?",
      answer: "Yes, we offer premium blue light filtering technology in both clear and slightly tinted options. These lenses are perfect for digital device users and can be added to any of our frames for enhanced eye protection."
    },
    {
      question: "Can I use my vision insurance?",
      answer: "We accept most major vision insurance providers. Please bring your insurance information when you visit, or contact us beforehand to verify your coverage. We also offer flexible payment plans."
    },
    {
      question: "How do I clean and maintain my glasses?",
      answer: "We recommend using the microfiber cloth provided with your glasses and lens cleaning spray. Avoid using household cleaners or paper towels. Store your glasses in their case when not in use and avoid leaving them in extreme temperatures."
    },
    {
      question: "Do you offer repairs and adjustments?",
      answer: "Yes, we provide professional repair and adjustment services for all types of eyewear. This includes nose pad replacement, screw tightening, frame reshaping, and temple arm adjustments. Many minor services are complimentary."
    },
    {
      question: "What makes your sunglasses different?",
      answer: "Our sunglasses feature 100% UV protection, polarized options, premium lens materials, and designer frames. We offer prescription sunglasses and custom tinting services to meet your specific vision and style needs."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <div className="sectionBlock">
          <h1 className="pageTitle2">Frequently Asked Questions</h1>
          <p className="pageLead2">Find answers to common questions about our eyewear products, services, and policies.</p>
          
          <div className="divider"></div>
          
          <div className="faq-list faq-accordion">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                <h3 className="faq-question" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                </h3>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
                {index < faqs.length - 1 && <div className="divider"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageQuestiona;