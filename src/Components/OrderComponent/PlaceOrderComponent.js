// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./PlaceOrder.css"; // Import the CSS file

// function PlaceOrderComponent() {
//   const [products, setProducts] = useState([]);
//   const [selectedProductId, setSelectedProductId] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [orderedQuantity, setOrderedQuantity] = useState(1); // Initialize to 1
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const foundProduct = products.find(
//       (product) => product.productId === selectedProductId
//     );
//     setSelectedProduct(foundProduct);
//   }, [selectedProductId, products]);

//   useEffect(() => {
//     if (selectedProduct) {
//       setTotalPrice(selectedProduct.unitPrice * orderedQuantity);
//     } else {
//       setTotalPrice(0);
//     }
//   }, [orderedQuantity, selectedProduct]);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get("http://localhost:5203/api/Products");
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       alert("Failed to fetch products");
//     }
//   };

//   const handleProductChange = (event) => {
//     setSelectedProductId(event.target.value);
//     setOrderedQuantity(1); // Reset quantity when product changes
//   };

//   const handleIncrementQuantity = () => {
//     if (selectedProduct && orderedQuantity < selectedProduct.availableQuantity) {
//       setOrderedQuantity((prevQuantity) => prevQuantity + 1);
//     } else if (!selectedProduct) {
//       alert("Please select a product first.");
//     } else {
//       alert(`Only ${selectedProduct.availableQuantity} available.`);
//     }
//   };

//   const handleDecrementQuantity = () => {
//     if (orderedQuantity > 1) {
//       setOrderedQuantity((prevQuantity) => prevQuantity - 1);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedProductId) {
//       alert("Please select a product");
//       return;
//     }
//     if (orderedQuantity < 1) {
//       alert("Please select a quantity greater than 0");
//       return;
//     }
//     if (selectedProduct && orderedQuantity > selectedProduct.availableQuantity) {
//       alert(`Only ${selectedProduct.availableQuantity} available.`);
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5203/api/Order",
//         {
//           productId: selectedProductId.trim(),
//           orderedQuantity: parseInt(orderedQuantity),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       alert("Order placed successfully!");
//       setSelectedProductId("");
//       setOrderedQuantity(1);
//       setSelectedProduct(null);
//       setTotalPrice(0);
//     } catch (error) {
//       console.error("Error placing order:", error);
//       if (error.response) {
//         alert(`Failed to place order: ${error.response.data}`);
//       } else if (error.request) {
//         alert("Failed to place order: No response from server");
//       } else {
//         alert(`Failed to place order: ${error.message}`);
//       }
//     }
//   };

//   return (
//     <div className="centering-container">
//     <div className="place-order-container">
//       <h2 className="place-order-title">Place Order</h2>

//       <div className="product-selection">
//         <div className="form-group">
//           <label className="form-label">Select Product:</label>
//           <br />
//           <select
//             className="form-select"
//             value={selectedProductId}
//             onChange={handleProductChange}
//           >
//             <option value="">Select a product</option>
//             {products.map((product) => (
//               <option key={product.productId} value={product.productId}>
//                 {product.productName} ({product.productId})
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="product-info-card">
//           <h3>Product Details</h3>
//           {selectedProduct ? (
//             <>
//               <p><strong>Price:</strong> ₹{selectedProduct.unitPrice}</p>
//               <p>
//                 <strong>Available Quantity :</strong> {selectedProduct.availableQuantity}
//               </p>
//             </>
//           ) : (
//             <p>Select a product to see details.</p>
//           )}
//         </div>
//       </div>

//       <div className="quantity-selection">
//         <label className="form-label">Order Quantity:</label>
//         <div className="quantity-controls">
//           <button
//             type="button"
//             className="quantity-button"
//             onClick={handleDecrementQuantity}
//           >
//             -
//           </button>
//           <input
//             type="number"
//             className="quantity-input"
//             value={orderedQuantity}
//             readOnly // Prevent direct editing
//           />
//           <button
//             type="button"
//             className="quantity-button"
//             onClick={handleIncrementQuantity}
//           >
//             +
//           </button>
//         </div>
//       </div>

//       {selectedProduct && (
//         <div className="total-price">
//           <strong>Total Price: ₹{totalPrice.toFixed(2)}</strong>
//         </div>
//       )}

//       <button className="place-order-button" onClick={handlePlaceOrder}>
//         Place Order
//       </button>
//     </div>
//     </div>
    
//   );
// }
// export default PlaceOrderComponent;

