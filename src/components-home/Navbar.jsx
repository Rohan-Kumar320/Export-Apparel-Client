// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";

const Navbar = ({ cart, toggleSidebar }) => {
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Export Apparels</h1>
          <p className="text-sm text-gray-500">By Saad Munir</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/cart")} className="relative text-gray-800 hover:text-gray-600">
            <FaShoppingCart className="text-xl sm:text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={toggleSidebar} className="text-gray-800 hover:text-gray-600">
            <FaBars className="text-xl sm:text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;