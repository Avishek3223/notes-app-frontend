import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-link-container">
          <a href="https://www.facebook.com/profile.php?id=100084340068772" className="footer-link">
            <div className="button button-facebook">
              <div className="icon">
                <i className="fab fa-facebook-f"></i>
                <div>
                  <span className="blue">Facebook</span>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="footer-link-container">
          <a href="https://www.instagram.com/_avishek_23_/" className="footer-link">
            <div className="button button-instagram">
              <div className="icon">
                <i className="fab fa-instagram"></i>
                <div>
                  <span className="pink">Instagram</span>
                </div>
              </div>
            </div>
          </a>
        </div>
        
        <div className="footer-link-container">
          <a href="https://www.linkedin.com/in/avishek-mishra-6b3910272/" className="footer-link">
            <div className="button button-linkedin">
              <div className="icon">
                <i className="fab fa-linkedin"></i>
                <div>
                  <span className="sky">LinkedIn</span>
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="links">
        <div className="footer-contact">
          <a href="/contact" className="footer-link">
            Contact Us
          </a>
        </div>
        <div className="footer-contact">
          <a href="/about" className="footer-link">
            About Us
          </a>
        </div>
        <div className="footer-contact">
          <a href="https://www.termsofservicegenerator.net/live.php?token=Nkktq2CylyXNV2aHceuRjLnzrv9Rtbm6" className="footer-link">
            Terms and Services
          </a>
        </div>
        <div className="footer-contact">
          <a href="https://www.termsfeed.com/live/1671f40b-3504-4672-8c1d-dc155a65299f" className="footer-link">
            Privacy Policy
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
