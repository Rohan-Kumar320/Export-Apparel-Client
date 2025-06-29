// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaHome, FaList, FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesList);
      } catch (err) {
        setError("Failed to load categories: " + err.message);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="p-4 flex justify-between items-center ">
        <h2 className="text-xl font-bold uppercase">Menu</h2>
        <button onClick={toggleSidebar}>
          <FaTimes className="text-xl" />
        </button>
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <button
          onClick={() => { navigate("/"); toggleSidebar(); }}
          className="uppercase flex items-center space-x-2 text-sm hover:bg-gray-700 p-2 rounded"
        >
          <FaHome />
          <span>Home</span>
        </button>
        <button
          onClick={() => { navigate("/track-order"); toggleSidebar(); }}
          className="uppercase flex items-center space-x-2 text-sm hover:bg-gray-700 p-2 rounded"
        >
          <FaList />
          <span>Track Order</span>
        </button>
        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="uppercase flex items-center space-x-2 text-sm hover:bg-gray-700 p-2 rounded w-full"
          >
            <FaList />
            <span>Categories</span>
          </button>
          {isCategoriesOpen && (
            <div className="ml-4 mt-2 space-y-2">
              {categories.length > 0 ? (
                categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { navigate(`/?category=${cat.name}`); toggleSidebar(); }}
                    className="block text-sm hover:bg-gray-700 p-2 rounded w-full text-left uppercase"
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No categories available</p>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-400 text-sm p-4">{error}</p>}
    </div>
  );
};

export default Sidebar;