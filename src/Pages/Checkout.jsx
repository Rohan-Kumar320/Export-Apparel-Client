import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !phone || !address) {
      setError("Please fill all required fields.");
      toast.error("Please fill all required fields.", { position: "bottom-right" });
      return;
    }
    setIsModalOpen(true); // Show confirmation modal
  };

  const confirmOrder = async () => {
    setIsModalOpen(false);
    setError("");
    try {
      const orderId = Date.now().toString();
      const orderData = {
        customerName: name,
        email,
        phone,
        address,
        additionalMessage,
        items: cart.map((item) => ({
          ...item,
          imageUrl: item.imageUrls?.[0] || item.imageUrl || "https://via.placeholder.com/400",
        })),
        total,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "orders", orderId), orderData);

      const message = `*New Order: ${orderId}*\n\n` +
        `*Customer Details:*\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Address: ${address}\n\n` +
        `*Order Items:*\n${cart
          .map(
            (item) =>
              `- ${item.name} (Qty: ${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`
          )
          .join("\n")}\n\n` +
        `*Total: Rs. ${total.toFixed(2)}*\n\n` +
        (additionalMessage ? `*Additional Message:*\n${additionalMessage}\n` : "");
      const whatsappUrl = `https://wa.me/923429715809?text=${encodeURIComponent(message)}`;

      console.log("Order submitted:", orderData);
      console.log("WhatsApp URL:", whatsappUrl);

      toast.success("Order placed successfully! Redirecting to WhatsApp...", {
        position: "bottom-right",
      });
      clearCart();
      window.location.href = whatsappUrl;
      navigate("/");
    } catch (err) {
      setError("Failed to place order: " + err.message);
      toast.error("Failed to place order: " + err.message, { position: "bottom-right" });
      console.error("Order submission error:", err);
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
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="mr-4 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            Back to Cart
          </button>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Checkout - Order Details
          </h2>
        </div>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Customer Information
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Additional Message to Vendor (Optional)
                </label>
                <textarea
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  rows="3"
                  placeholder="E.g., Please include gift wrapping or specify delivery time"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Place Order via WhatsApp
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 text-sm">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4 border-dashed border-gray-300">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
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
                  Confirm Order Submission
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p className="mb-2">
                    <strong>Order Summary:</strong> Your order includes {cart.length} item
                    {cart.length > 1 ? "s" : ""} for a total of Rs. {total.toFixed(2)}.
                  </p>
                  <p className="mb-2">
                    <strong>Customer Details:</strong> {name}, {email}, {phone}
                  </p>
                  <p className="mb-2">
                    <strong>Delivery Address:</strong> {address}
                  </p>
                  {additionalMessage && (
                    <p className="mb-2">
                      <strong>Additional Message:</strong> {additionalMessage}
                    </p>
                  )}
                  <p className="mb-2">
                    <strong>Next Steps:</strong> Confirming will save your order and
                    redirect you to WhatsApp to share order details with the vendor.
                  </p>
                  <p>
                    <strong>Note:</strong> No online payment is required. Payment details
                    will be coordinated via WhatsApp. To share product images, please attach
                    them manually in WhatsApp after redirection.
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
                    onClick={confirmOrder}
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

export default Checkout;