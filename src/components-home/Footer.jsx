// src/components/Footer.jsx
import { FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Export Apparels</h3>
          <p className="text-sm">By Saad Munir</p>
          <p className="text-sm mt-2">Quality clothing for everyone.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/cart" className="hover:underline">Cart</a></li>
            <li><a href="/track-order" className="hover:underline">Track Order</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm flex items-center"><FaPhone className="mr-2" /> +1234567890</p>
          <p className="text-sm flex items-center mt-2"><FaEnvelope className="mr-2" /> support@exportapparels.com</p>
        </div>
      </div>
      <div className="text-center text-sm mt-6">
        <p>&copy; 2025 Export Apparels. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;