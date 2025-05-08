// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './GetAllStockComponent.css'; // Import CSS file

// function GetAllStockComponent() {
//   const [stockList, setStockList] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const stocksPerPage = 3; // Adjust as needed

//   useEffect(() => {
//     fetchStock();
//   }, []);

//   const fetchStock = async () => {
//     try {
//       const res = await axios.get('https://webapiproject-ffx8.onrender.com/api/Stock/AllStock');
//       setStockList(res.data);
//     } catch (error) {
//       alert('Failed to fetch stock');
//       console.error("Error fetching stock:", error);
//     }
//   };

//   // Pagination logic
//   const indexOfLastStock = currentPage * stocksPerPage;
//   const indexOfFirstStock = indexOfLastStock - stocksPerPage;
//   const currentStocks = stockList.slice(indexOfFirstStock, indexOfLastStock);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(stockList.length / stocksPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <div className='liststock'>
//     <div className="get-all-stock-container stylish-container">
//       <h2 className="get-all-stock-title">Available Stock</h2>
//       {stockList.length === 0 ? (
//         <p className="no-stock-message">No stock available.</p>
//       ) : (
//         <>
//           <div className="carousel-container">
//             <div className="carousel-row">
//               {currentStocks.map(stock => (
//                 <div key={stock.productId} className="carousel-card stylish-card">
//                   <h4>{stock.productName}</h4>
//                   <p><strong>Product ID:</strong> {stock.productId}</p>
//                   <p><strong>Available Quantity:</strong> {stock.availableQuantity}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//           {stockList.length > stocksPerPage && (
//             <nav className="pagination">
//               <ul className="pagination-list">
//                 {pageNumbers.map((number) => (
//                   <li
//                     key={number}
//                     className={`pagination-item ${currentPage === number ? 'active' : ''}`}
//                   >
//                     <button onClick={() => paginate(number)} className="pagination-link stylish-pagination-button">
//                       {number}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>
//           )}
//         </>
//       )}
//     </div>
//     </div>
//   );
// }

// export default GetAllStockComponent;