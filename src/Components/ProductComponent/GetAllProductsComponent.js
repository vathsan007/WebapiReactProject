import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetAllProductsComponent.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
 
function GetAllProductsComponent() {
  const [products, setProducts] = useState([]);
  const [orderedQuantities, setOrderedQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchProducts();
  }, []);
 
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5203/api/Products');
      setProducts(response.data);
      // toast.success('Products loaded successfully!');
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products.');
    }
  };
 
  const handleQuantityChange = (productId, quantity) => {
    setOrderedQuantities({
      ...orderedQuantities,
      [productId]: quantity,
    });
  };
 
  const placeOrder = async (productId) => {
    const orderedQuantity = orderedQuantities[productId];
    if (!orderedQuantity || parseInt(orderedQuantity) <= 0) {
      toast.warn('Please enter a valid quantity.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5203/api/Order',
        {
          productId: productId.trim(),
          orderedQuantity: parseInt(orderedQuantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Order placed successfully!');
      setOrderedQuantities((prev) => ({ ...prev, [productId]: '' }));
      navigate('/payment');
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        toast.error(`Failed: ${error.response.data}`);
      } else if (error.request) {
        toast.error('No response from server');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };
 
  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }
 
  return (
    <div className="get-all-products-container">
      <ToastContainer position='bottom-right'/>
      <h2>Products</h2>
 
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.productId} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="product-image"
                  />
                </div>
                <div className="product-details">
                  <h3>{product.productName}</h3>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p className="description">{product.description}</p>
                  <p className="price">₹{product.unitPrice}</p>
                  <p className="availability">Available: {product.availableQuantity}</p>
 
                  <input
                    type="number"
                    min="1"
                    className="quantity-input"
                    placeholder="Qty"
                    value={orderedQuantities[product.productId] || ''}
                    onChange={(e) =>
                      handleQuantityChange(product.productId, e.target.value)
                    }
                  />
                  <button
                    className="order-button"
                    onClick={() => placeOrder(product.productId)}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          {products.length > productsPerPage && (
            <nav className="pagination">
              <ul className="pagination-list">
                {pageNumbers.map((number) => (
                  <li
                    key={number}
                    className={`pagination-item ${
                      currentPage === number ? 'active' : ''
                    }`}
                  >
                    <button
                      onClick={() => paginate(number)}
                      className="pagination-link"
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
 
export default GetAllProductsComponent;
 
 