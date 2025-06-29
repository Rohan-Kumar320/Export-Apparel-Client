// src/components/ProductCard.jsx
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product, addToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { position: "bottom-right" });
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.imageUrls?.[0] || product.imageUrl || "https://via.placeholder.com/400"}
        alt={product.name}
        className="w-full h-32 sm:h-40 object-cover rounded-md mb-3"
      />
      <h3 className="text-base font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{product.description || "No description"}</p>
      <p className="text-blue-600 font-bold text-base mt-2">Rs. {product.price.toFixed(2)}</p>
      <p className="text-gray-500 text-xs">Category: {product.category}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart();
        }}
        className="mt-3 w-full bg-gray-800 text-white p-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center text-sm"
      >
        <FaShoppingCart className="mr-2" /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;