import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Home = ({ addToCart, cart }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      console.log("Fetching products from Firestore...");
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        console.log("Products fetched:", productsList);
        toast.success("Products loaded successfully!", { position: "bottom-right" });
      } catch (err) {
        console.error("Products fetch error:", err);
        if (err.code === "permission-denied") {
          setError(
            "Permission denied. Please ensure you have access to view products or contact support."
          );
          toast.error(
            "Permission denied. Please check Firestore permissions or contact support.",
            { position: "bottom-right" }
          );
        } else {
          setError("Failed to load products: " + err.message);
          toast.error("Failed to load products: " + err.message, {
            position: "bottom-right",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (typeof addToCart === "function") {
      addToCart(product);
      toast.success(`${product.name} added to cart!`, { position: "bottom-right" });
      console.log("Added to cart:", product);
    } else {
      toast.error("Unable to add to cart. Please try again.", {
        position: "bottom-right",
      });
      console.error("addToCart is not a function");
    }
  };

  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "-100vw" }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen bg-gray-100 flex justify-center"
    >
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Export Apparels
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Cart ({cart.length})
            </button>
            <button
              onClick={() => navigate("/track-order")}
              className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
            >
              Track Order
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {isLoading && (
          <p className="text-gray-600 text-sm text-center">Loading products...</p>
        )}
        {products.length === 0 && !isLoading && !error && (
          <p className="text-gray-600 text-sm text-center">No products available.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-md border border-dashed border-gray-300"
            >
              <img
                src={
                  product.imageUrls?.[0] ||
                  product.imageUrl ||
                  "https://via.placeholder.com/400"
                }
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name || "Unnamed Product"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Rs. {(product.price || 0).toFixed(2)}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;