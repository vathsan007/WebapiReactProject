// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './DeleteProductComponent.css'; // Import CSS file

// function DeleteProductComponent() {
//   const [products, setProducts] = useState([]);
//   const [selectedProductId, setSelectedProductId] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 3; // Adjust as needed

//   const fetchProducts = () => {
//     axios.get('https://webapiproject-ffx8.onrender.com/api/Products')
//       .then(res => setProducts(res.data))
//       .catch(() => alert('Failed to load products'));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleDelete = () => {
//     if (!selectedProductId) {
//       alert('Please select a product to delete');
//       return;
//     }

//     axios.delete(`https://webapiproject-ffx8.onrender.com/api/Products/${selectedProductId}`)
//       .then(() => {
//         alert('Product deleted');
//         setSelectedProductId('');
//         fetchProducts();
//       })
//       .catch(() => alert('Failed to delete product'));
//   };

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className='delete-product'>
//     <div className="delete-product-container stylish-container">
//       <h2 className="delete-product-title">Delete Product</h2>

//       <div className="selection-panel stylish-card">
//         <label htmlFor="productSelect" className="form-label">Select Product to Delete:</label>
//         <select
//           id="productSelect"
//           className="form-select"
//           value={selectedProductId}
//           onChange={(e) => setSelectedProductId(e.target.value)}
//         >
//           <option value="">Select Product</option>
//           {products.map(prod => (
//             <option key={prod.productId} value={prod.productId}>
//               {prod.productName} ({prod.productId})
//             </option>
//           ))}
//         </select>
//         <button onClick={handleDelete} className="delete-button stylish-button">
//           Delete Product
//         </button>
//       </div>

//       <div className="current-products-panel">
//         <h3>Current Products</h3>
//         {products.length === 0 ? (
//           <p className="no-products-message">No products available.</p>
//         ) : (
//           <div className="products-list">
//             {currentProducts.map(product => (
//               <div key={product.productId} className="product-item stylish-card">
//                 <p><strong>Product ID:</strong> {product.productId}</p>
//                 <p><strong>Name:</strong> {product.productName}</p>
//                 <p><strong>Available Quantity:</strong> {product.availableQuantity}</p>
//               </div>
//             ))}
//           </div>
//         )}
//         {products.length > productsPerPage && (
//           <nav className="pagination">
//             <ul className="pagination-list">
//               {pageNumbers.map((number) => (
//                 <li
//                   key={number}
//                   className={`pagination-item ${
//                     currentPage === number ? 'active' : ''
//                   }`}
//                 >
//                   <button
//                     onClick={() => paginate(number)}
//                     className="pagination-link stylish-pagination-button"
//                   >
//                     {number}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// }

// export default DeleteProductComponent;