import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";

const Cart = ({ cart, updateQuantity, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false); // For forcing re-render
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Debug props and cart state
  console.log("Cart props:", {
    cart,
    updateQuantity: typeof updateQuantity,
    removeFromCart: typeof removeFromCart,
    clearCart: typeof clearCart,
  });
  console.log("Cart contents:", cart);
  console.log("localStorage cart:", localStorage.getItem("cart"));

  const handleRemove = (id, name) => {
    if (typeof removeFromCart === "function") {
      removeFromCart(id);
      setForceUpdate((prev) => !prev); // Force re-render
      toast.success(`${name} removed from cart!`, { position: "bottom-right" });
    } else {
      toast.error("Unable to remove item. Please try again.", { position: "bottom-right" });
    }
  };

  const handleQuantityChange = (id, quantity, name) => {
    if (quantity < 1) return;
    if (typeof updateQuantity === "function") {
      updateQuantity(id, quantity);
      setForceUpdate((prev) => !prev); // Force re-render
      toast.info(`${name} quantity updated!`, { position: "bottom-right" });
    } else {
      toast.error("Unable to update quantity. Please try again.", { position: "bottom-right" });
    }
  };

  const handleClearCart = () => {
    console.log("Attempting to clear cart...");
    if (typeof clearCart === "function") {
      clearCart();
      setForceUpdate((prev) => !prev); // Force re-render
      localStorage.setItem("cart", JSON.stringify([])); // Ensure localStorage is cleared
      toast.success("Cart cleared successfully!", { position: "bottom-right" });
      console.log("Cart cleared via clearCart function");
    } else {
      // Fallback: directly clear localStorage and cart
      localStorage.setItem("cart", JSON.stringify([]));
      toast.error("Cart cleared locally due to missing clearCart function.", {
        position: "bottom-right",
      });
      console.log("Cart cleared via fallback");
    }
    console.log("localStorage after clear:", localStorage.getItem("cart"));
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const confirmCheckout = () => {
    setIsModalOpen(false);
    navigate("/checkout", { state: { fromCart: true } });
  };

  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: 0 }}
      exit={{ x: "-100vw" }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="min-h-screen bg-gray-100 flex justify-center"
    >
      <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-4 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            Back to Home
          </button>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Export Apparels Receipt
          </h2>
        </div>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base text-center">
            Your cart is empty.
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-dashed border-gray-300 p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-4">
              Order Receipt
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left text-sm">Image</th>
                    <th className="p-3 text-left text-sm">Item</th>
                    <th className="p-3 text-left text-sm">Price</th>
                    <th className="p-3 text-left text-sm">Qty</th>
                    <th className="p-3 text-left text-sm">Total</th>
                    <th className="p-3 text-right text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <img
                          src={
                            item.imageUrls?.[0] ||
                            item.imageUrl ||
                            "https://via.placeholder.com/400"
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 text-sm">{item.name}</td>
                      <td className="p-3 text-sm">Rs. {item.price.toFixed(2)}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value) || 1,
                              item.name
                            )
                          }
                          min="1"
                          className="w-16 p-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="p-3 text-sm">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex justify-between items-center border-t border-dashed border-gray-300 mt-4">
              <h3 className="text-lg font-bold text-gray-800">
                Total: Rs. {total.toFixed(2)}
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={handleClearCart}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                >
                  <FaRegTrashAlt />
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Processing Details
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p className="mb-2">
                    <strong>Order Summary:</strong> Your order includes {cart.length} item
                    {cart.length > 1 ? "s" : ""} for a total of Rs. {total.toFixed(2)}.
                  </p>
                  <p className="mb-2">
                    <strong>Next Steps:</strong> You will fill out your information in
                    the checkout form. This information, along with your order details,
                    will be shared directly with our vendor.
                  </p>
                  <p className="mb-2">
                    <strong>Vendor Communication:</strong> After submitting the form,
                    you will be redirected to WhatsApp to confirm your order and discuss
                    further details with the vendor.
                  </p>
                  <p>
                    <strong>Note:</strong> No online payment is required. Payment details
                    will be coordinated directly with the vendor via WhatsApp.
                  </p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCheckout}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Cart;