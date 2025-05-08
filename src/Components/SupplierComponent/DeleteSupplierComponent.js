import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeleteSupplierComponent.css'; // Import CSS file
 
function DeleteSupplierComponent() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 5;
 
  const fetchSuppliers = () => {
    axios.get('http://localhost:5203/api/Supplier')
      .then(res => setSuppliers(res.data))
      .catch(() => toast.error('Failed to fetch suppliers'));
  };
 
  useEffect(() => {
    fetchSuppliers();
  }, []);
 
  const handleDelete = () => {
    if (!selectedSupplierId) {
      toast.error('Please select a supplier to delete.');
      return;
    }
 
    axios.delete(`http://localhost:5203/api/Supplier/${selectedSupplierId}`)
      .then(() => {
        toast.success('Supplier deleted successfully!');
        fetchSuppliers(); // refresh list
        setSelectedSupplierId(''); // Reset dropdown
      })
      .catch(() => toast.error('Failed to delete supplier'));
  };
 
  const handleSupplierChange = (event) => {
    setSelectedSupplierId(event.target.value);
  };
 
  // Pagination logic
  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
  const totalPages = Math.ceil(suppliers.length / suppliersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);
 
  return (
    <div className="delete-supplier-container">
      <ToastContainer />
      <h2>Delete Supplier</h2>
 
      <div className="delete-form">
        <label htmlFor="supplierSelect">Select Supplier to Delete:</label>
        <select
          id="supplierSelect"
          className="supplier-dropdown"
          value={selectedSupplierId}
          onChange={handleSupplierChange}
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map(supplier => (
            <option key={supplier.supplierId} value={supplier.supplierId}>
              {supplier.supplierName} (ID: {supplier.supplierId})
            </option>
          ))}
        </select>
        <button onClick={handleDelete} className="delete-button" disabled={!selectedSupplierId}>
          Delete Supplier
        </button>
      </div>
 
      <h3>All Suppliers</h3>
      {suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <>
          <table className="supplier-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {currentSuppliers.map(supplier => (
                <tr key={supplier.supplierId}>
                  <td>{supplier.supplierId}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
 
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={currentPage === number ? 'active' : ''}
                >
                  {number}
                </button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
 
export default DeleteSupplierComponent;
 