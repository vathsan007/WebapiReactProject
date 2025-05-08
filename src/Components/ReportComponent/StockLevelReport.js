import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockLevelReport.css';
import { FaArrowUp } from 'react-icons/fa'; // Import the up arrow icon

const StockLevelReport = () => {
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [showScrollUpButton, setShowScrollUpButton] = useState(false); // State for button visibility

  useEffect(() => {
    const fetchStockReport = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5203/api/Report/stock-level', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStockData(response.data);
        setFilteredData(response.data);
        const uniqueSuppliers = [...new Set(response.data.map(item => item.supplierName).filter(Boolean))];
        const uniqueProducts = [...new Set(response.data.map(item => item.productName).filter(Boolean))];
        setAllSuppliers(['', ...uniqueSuppliers]);
        setAllProducts(['', ...uniqueProducts]);
      } catch (error) {
        console.error('Error fetching stock level report:', error);
      }
    };
    fetchStockReport();

    // Add scroll event listener to show/hide the scroll up button
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollUpButton(true);
      } else {
        setShowScrollUpButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const filtered = stockData.filter(item => {
      const matchSupplier = !supplierFilter || item.supplierName?.toLowerCase().includes(supplierFilter.toLowerCase());
      const matchProduct = !productFilter || item.productName?.toLowerCase().includes(productFilter.toLowerCase());
      const matchQuantity = !quantityFilter || item.availableQuantity >= parseInt(quantityFilter);
      return matchSupplier && matchProduct && matchQuantity;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [supplierFilter, productFilter, quantityFilter, stockData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="stock-report-container">
      <div className="report-header">
        <h2>Stock Level Report</h2>
        <div className="filters">
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          >
            <option value="">Filter by Supplier</option>
            {allSuppliers.map((supplier, index) => (
              <option key={index} value={supplier}>
                {supplier || 'All Suppliers'}
              </option>
            ))}
          </select>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
          >
            <option value="">Filter by Product</option>
            {allProducts.map((product, index) => (
              <option key={index} value={product}>
                {product || 'All Products'}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Minimum Quantity"
            value={quantityFilter}
            onChange={(e) => setQuantityFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="report-cards">
        {currentItems.map((item, index) => (
          <div key={index} className="report-card">
            <h3>{item.productName}</h3>
            <p><strong>Product ID:</strong> {item.productId}</p>
            <p><strong>Available Quantity:</strong> {item.availableQuantity}</p>
            <p><strong>Supplier Name:</strong> {item.supplierName}</p>
          </div>
        ))}
        {currentItems.length === 0 && <p className="no-data">No stock data matches your filters.</p>}
      </div>

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

      {showScrollUpButton && (
        <button onClick={scrollToTop} className="scroll-up-button">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default StockLevelReport;