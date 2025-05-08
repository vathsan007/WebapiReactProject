// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './AllSupplierComponent.css'; // Import CSS file
 
// function AllSupplierComponent() {
//   const [suppliers, setSuppliers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const suppliersPerPage = 5;
 
//   useEffect(() => {
//     fetchSuppliers();
//   }, []);
 
//   const fetchSuppliers = async () => {
//     try {
//       const response = await axios.get('http://localhost:5203/api/Supplier');
//       setSuppliers(response.data);
//     } catch (error) {
//       alert('Failed to fetch suppliers');
//       console.error('Error fetching suppliers:', error);
//     }
//   };
 
//   // Pagination logic
//   const indexOfLastSupplier = currentPage * suppliersPerPage;
//   const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
//   const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
 
//   const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
 
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }
 
//   return (
//     <div className='allsup'>
 
   
//     <div className="supplier-list-container">
//       <h2> Suppliers</h2>
//       {suppliers.length === 0 ? (
//         <p>No suppliers found.</p>
//       ) : (
//         <>
//           <table className="supplier-table">
//             <thead>
//               <tr>
//                 <th className="header-id">ID</th>
//                 <th className="header-name">Name</th>
//                 <th className="header-phone">Phone</th>
//                 <th className="header-email">Email</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentSuppliers.map(supplier => (
//                 <tr key={supplier.supplierId}>
//                   <td>{supplier.supplierId}</td>
//                   <td>{supplier.supplierName}</td>
//                   <td>{supplier.phone}</td>
//                   <td>{supplier.email}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
 
//           {totalPages > 1 && (
//             <div className="pagination">
//               <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
//                 Previous
//               </button>
//               {pageNumbers.map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={currentPage === number ? 'active' : ''}
//                 >
//                   {number}
//                 </button>
//               ))}
//               <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//     </div>
//   );
// }
 
// export default AllSupplierComponent;
 