// src/components/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FaShoppingCart, FaArrowLeft, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import ProductCard from "./ProductCard";

const ProductDetail = ({ addToCart }) => {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current product
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          // Handle single imageUrl for backward compatibility
          if (productData.imageUrl && !productData.imageUrls) {
            productData.imageUrls = [productData.imageUrl];
          }
          setProduct(productData);

          // Fetch similar products (same category, exclude current product)
          const productsQuery = query(
            collection(db, "products"),
            where("category", "==", productData.category)
          );
          const productsSnapshot = await getDocs(productsQuery);
          const similarList = productsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(prod => prod.id !== id)
            .slice(0, 4); // Limit to 4 products
          setSimilarProducts(similarList);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product: " + err.message);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { position: "bottom-right" });
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  if (error) return <p className="text-red-500 text-center p-8 text-sm">{error}</p>;
  if (!product) return (
    <div className="container mx-auto p-8">
      <div className="h-64 sm:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    </div>
  );

  const images = product.imageUrls || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-800 mb-6 hover:text-blue-600 transition text-sm sm:text-base"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Image Carousel */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src={images[currentImageIndex] || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-64 sm:h-96 object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex mt-4 space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer border-2 ${
                      currentImageIndex === index ? "border-blue-600" : "border-gray-200"
                    } hover:border-blue-400 transition`}
                    onClick={() => handleImageChange(index)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{product.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(4)].map((_, i) => <FaStar key={i} />)}
                <FaStar className="text-gray-300" />
              </div>
              <span className="text-sm text-gray-600">(4.5 / 5)</span>
            </div>
            <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
              {product.description || "No description available"}
            </p>
            <div className="relative inline-block mb-4">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-100 to-white pr-4 py-1 rounded">
                Rs. {product.price.toFixed(2)}
              </p>
            </div>
            <p className="text-gray-500 text-sm mb-6">Category: {product.category}</p>
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-2/3 bg-gray-800 text-white p-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center text-sm sm:text-base"
            >
              <FaShoppingCart className="mr-2" /> Add to Cart
            </button>
            {/* Static Product Highlights */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Highlights</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span> Premium Quality Fabric</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span> Comfort Fit Design</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span> Easy to Wash</li>
              </ul>
            </div>
          </div>
        </div>
        {/* You May Also Like Section */}
        {similarProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">You May Also Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;