import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderTracking from "./Pages/OrderTracking";
import ProductDetail from "./components/ProductDetail"

const App = () => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing localStorage cart:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart saved to localStorage:", cart);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        const newCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        console.log("Updated cart (addToCart):", newCart);
        return newCart;
      }
      const newCart = [...prev, { ...product, quantity: 1 }];
      console.log("Updated cart (addToCart):", newCart);
      return newCart;
    });
  };

  const updateQuantity = (id, quantity) => {
    const parsedQuantity = parseInt(quantity) || 1;
    if (parsedQuantity < 1) return;
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: parsedQuantity } : item
      );
      console.log("Updated cart (updateQuantity):", newCart);
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      console.log("Updated cart (removeFromCart):", newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    console.log("Cart cleared, localStorage updated:", localStorage.getItem("cart"));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} cart={cart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} />}
        />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="*" element={<Home addToCart={addToCart} cart={cart} />} />
      </Routes>
    </Router>
  );
};

export default App;