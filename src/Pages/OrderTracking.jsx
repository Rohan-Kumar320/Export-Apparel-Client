import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setIsLoading(true);
    console.log("Fetching order with ID:", orderId);

    try {
      const docRef = doc(db, "orders", orderId.trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const orderData = { id: docSnap.id, ...docSnap.data() };
        setOrder(orderData);
        console.log("Order fetched:", orderData);
        toast.success("Order found!", { position: "bottom-right" });
      } else {
        setError("Order not found. Please check the Order ID.");
        toast.error("Order not found. Please check the Order ID.", {
          position: "bottom-right",
        });
        console.log("Order not found for ID:", orderId);
      }
    } catch (err) {
      setError("Failed to fetch order: " + err.message);
      toast.error("Failed to fetch order: " + err.message, { position: "bottom-right" });
      console.error("Order fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="mr-4 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition text-sm sm:text-base"
          >
            Back to Home
          </button>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Track Your Order
          </h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Enter Order ID
          </h3>
          <form onSubmit={handleTrack}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.trim())}
                className="w-full sm:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                placeholder="Enter your Order ID"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto p-3 rounded-lg text-sm sm:text-base transition ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Tracking..." : "Track Order"}
            </button>
          </form>
        </div>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {isLoading && (
          <p className="text-gray-600 text-sm text-center">Loading order details...</p>
        )}
        {order && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Details
            </h3>
            <div className="mb-4 text-sm sm:text-base">
              <p>
                <strong>Order ID:</strong> {order.id}
              </p>
              <p>
                <strong>Customer:</strong> {order.customerName}
              </p>
              <p>
                <strong>Email:</strong> {order.email || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              {order.additionalMessage && (
                <p>
                  <strong>Additional Message:</strong> {order.additionalMessage}
                </p>
              )}
              <p>
                <strong>Status:</strong>
                <span
                  className={`inline-block ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </p>
              <p>
                <strong>Placed On:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left text-sm sm:text-base">Image</th>
                    <th className="p-3 text-left text-sm sm:text-base">Name</th>
                    <th className="p-3 text-left text-sm sm:text-base">Quantity</th>
                    <th className="p-3 text-left text-sm sm:text-base">Price</th>
                    <th className="p-3 text-left text-sm sm:text-base">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">
                        <img
                          src={
                            item.imageUrl || "https://via.placeholder.com/400"
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-3 text-sm sm:text-base">{item.name}</td>
                      <td className="p-3 text-sm sm:text-base">{item.quantity}</td>
                      <td className="p-3 text-sm sm:text-base">
                        Rs. {item.price.toFixed(2)}
                      </td>
                      <td className="p-3 text-sm sm:text-base">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <p className="text-lg font-bold text-gray-800">
                Total: Rs. {order.total.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderTracking;