import React from 'react';
import '../CSS/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/images/logo.png" alt="Duck Donuts Logo" />
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <a href="#menu">menu</a>
            <a href="#online-order">u.s. online order</a>
            <a href="#franchising">u.s. franchising</a>
            <a href="#collaborations">collaborations</a>
          </div>
          <div className="footer-column">
            <a href="#locations">locations</a>
            <a href="#puerto-rico-order">puerto rico online order</a>
            <a href="#international-franchising">international franchising</a>
          </div>
          <div className="footer-column">
            <a href="#catering">catering</a>
            <a href="#contact-us">contact us</a>
            <a href="#nutrition">nutrition & allergy info</a>
          </div>
        </div>
        <div className="footer-social">
          <a href="#facebook">FB</a>
          <a href="#twitter">X</a>
          <a href="#instagram">IG</a>
        </div>
        <div className="footer-search">
          <input type="text" placeholder="Search" />
          <button>Go</button>
        </div>
      </div>
      <div class="footer-container">
    <div class="footer-content">
    </div>
    <div class="footer-bottom">
        <p>© 2023 Your Company. All rights reserved.</p>
        <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
        </div>
    </div>
</div>
    </footer>
  );
};

export default Footer;
