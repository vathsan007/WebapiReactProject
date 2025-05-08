import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CancelOrderComponent.css';
import { ToastContainer,toast } from 'react-toastify';

function CancelOrderComponent() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Set the number of orders to display per page
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Extract unique status values from the orders
    const uniqueStatuses = [...new Set(orders.map(order => order.status))];
    setStatusOptions(['All', ...uniqueStatuses]);
    setFilteredOrders(orders); // Initialize filtered orders with all orders
    setCurrentPage(1); // Reset to the first page when orders change
  }, [orders]);

  useEffect(() => {
    // Filter orders based on the selected status
    if (selectedStatus === 'All' || !selectedStatus) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === selectedStatus);
      setFilteredOrders(filtered);
    }
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [selectedStatus, orders]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5203/api/Order/details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.warn('Failed to fetch orders');
    }
  };

  const handleCancel = async (orderId) => {
    if (
      toast(window.confirm(`Are you sure you want to cancel order ${orderId}?`))
    
    ) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5203/api/Order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success(`Order ${orderId} cancelled successfully`);
        fetchOrders(); // refresh orders
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.warn('Failed to cancel the order');
      }
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Logic for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="cancel-orders-container">
      <ToastContainer
      theme='dark'
      position="bottom-right"
      />
      <h2 className="cancel-orders-title">Cancel Orders</h2>

      <div className="filter-section">
        <label htmlFor="statusFilter" className="filter-label">Filter by Status:</label>
        <select
          id="statusFilter"
          className="status-dropdown"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="orders-grid">
        {currentOrders.length === 0 ? (
          <p className="no-orders-message">No orders found with the selected criteria on this page.</p>
        ) : (
          currentOrders.map(order => (
            <div key={order.orderId} className="order-card">
              <h4>{order.productName}</h4>
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Quantity:</strong> {order.orderedQuantity}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <button className="cancel-button" onClick={() => handleCancel(order.orderId)}>
                Cancel Order
              </button>
            </div>
          ))
        )}
      </div>

      {filteredOrders.length > ordersPerPage && (
        <nav className="pagination">
          <ul className="pagination-list">
            {pageNumbers.map(number => (
              <li key={number} className={`pagination-item ${currentPage === number ? 'active' : ''}`}>
                <button onClick={() => paginate(number)} className="pagination-link">
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default CancelOrderComponent;