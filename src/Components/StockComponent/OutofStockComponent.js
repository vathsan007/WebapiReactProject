import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OutOfStockComponent.css'; // Import the CSS file

function OutOfStockComponent() {
  const [outOfStock, setOutOfStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // You can adjust the number of cards per page

  useEffect(() => {
    const fetchOutOfStockData = async () => {
      try {
        const res = await axios.get('http://localhost:5203/api/Stock/OutofStock');
        setOutOfStock(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching out-of-stock data:", err);
        setError('Failed to fetch out-of-stock data. Please try again later.');
        setLoading(false);
      }
    };

    fetchOutOfStockData();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = outOfStock.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(outOfStock.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`oos-pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="oos-container">
      <h2 className="oos-heading">Out of Stock Products</h2>
      {loading ? (
        <p className="oos-loading">Loading out-of-stock products...</p>
      ) : error ? (
        <p className="oos-error">{error}</p>
      ) : outOfStock.length === 0 ? (
        <p className="oos-no-stock">No product is out of stock</p>
      ) : (
        <>
          <div className="oos-product-list">
            {currentProducts.map(stock => (
              <div key={stock.productId} className="oos-product-card">
                <h4 className="oos-product-id">Product Name: {stock.productName}</h4>
                <p className="oos-product-info">
                  <strong className="oos-bold-text">Product ID:</strong> {stock.productId}
                </p>
                <p className="oos-product-info">
                  <strong className="oos-bold-text">Available Quantity:</strong> {stock.availableQuantity}
                </p>
                {/* You can add more product details here */}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="oos-pagination">
              {renderPageNumbers()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OutOfStockComponent;