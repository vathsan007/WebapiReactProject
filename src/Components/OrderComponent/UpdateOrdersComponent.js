import React, { useEffect, useState } from 'react';
 
import axios from 'axios';
 
import { toast, ToastContainer } from 'react-toastify';
 
import 'react-toastify/dist/ReactToastify.css';
 
import './UpdateOrdersComponent.css';
 
import { FaArrowUp } from 'react-icons/fa';
 
function UpdateOrdersComponent() {
 
    const [orders, setOrders] = useState([]);
 
    const [editId, setEditId] = useState('');
 
    const [newStatus, setNewStatus] = useState('');
 
    const [currentPage, setCurrentPage] = useState(1);
 
    const [filter, setFilter] = useState('Placed');
 
    const ordersPerPage = 4;
 
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);
 
    const fetchOrders = () => {
 
        axios.get('https://webapiproject-ffx8.onrender.com/api/Order/details')
 
            .then(res => setOrders(res.data))
 
            .catch(() => toast.error('Failed to fetch orders'));
 
    };
 
    useEffect(() => {
 
        fetchOrders();
 
        const handleScroll = () => {
 
            if (window.scrollY > 200) {
 
                setShowScrollUpButton(true);
 
            } else {
 
                setShowScrollUpButton(false);
 
            }
 
        };
 
        window.addEventListener('scroll', handleScroll);
 
        return () => {
 
            window.removeEventListener('scroll', handleScroll);
 
        };
 
    }, []);
 
    const handleUpdateStatus = (orderId) => {
 
        if (!newStatus) {
 
            toast.info('Please select a status');
 
            return;
 
        }
 
        axios.put(`https://webapiproject-ffx8.onrender.com/api/Order/${orderId}`, `"${newStatus}"`, {
 
            headers: {
 
                'Content-Type': 'application/json'
 
            }
 
        })
 
            .then(() => {
 
                toast.success('Order status updated successfully');
 
                setEditId('');
 
                setNewStatus('');
 
                fetchOrders();
 
            })
 
            .catch(() => toast.error('Failed to update status'));
 
    };
 
    const filteredOrders = orders.filter(order => order.status === filter);
 
    const indexOfLastOrder = currentPage * ordersPerPage;
 
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
 
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
 
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
    const pageNumbers = [];
 
    for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
 
        pageNumbers.push(i);
 
    }
 
    const getButtonColor = (status) => {
 
        switch (status) {
 
            case 'Placed':
 
                return '#0b5ed7';
 
            case 'Shipped':
 
                return '#a0522d';
 
            case 'Cancelled':
 
                return '#dc3545';
 
            case 'Delivered':
 
                return '#28a745';
 
            default:
 
                return '#6c757d';
 
        }
 
    };
 
    const getButtonHoverColor = (status) => {
 
        switch (status) {
 
            case 'Placed':
 
                return '#094ab0';
 
            case 'Shipped':
 
                return '#843c0c';
 
            case 'Cancelled':
 
                return '#c82333';
 
            case 'Delivered':
 
                return '#1e7e34';
 
            default:
 
                return '#5a6268';
 
        }
 
    };
 
    const scrollToTop = () => {
 
        window.scrollTo({ top: 0, behavior: 'smooth' });
 
    };
 
    return (
 
        <div className="update-orders-container">
 
            <p className="update-orders-title">All Orders</p>
 
            <div className="filter-links">
 
                <button
 
                    onClick={() => setFilter('Placed')}
 
                    className={`filter-link ${filter === 'Placed' ? 'active' : ''}`}
 
                    style={{ backgroundColor: filter === 'Placed' ? getButtonColor('Placed') : '', color: filter === 'Placed' ? 'white' : '' }}
 
                >
 
                    Placed
 
                </button>
 
                <button
 
                    onClick={() => setFilter('Shipped')}
 
                    className={`filter-link ${filter === 'Shipped' ? 'active' : ''}`}
 
                    style={{ backgroundColor: filter === 'Shipped' ? getButtonColor('Shipped') : '', color: filter === 'Shipped' ? 'white' : '' }}
 
                >
 
                    Shipped
 
                </button>
 
                <button
 
                    onClick={() => setFilter('Delivered')}
 
                    className={`filter-link ${filter === 'Delivered' ? 'active' : ''}`}
 
                    style={{ backgroundColor: filter === 'Delivered' ? getButtonColor('Delivered') : '', color: filter === 'Delivered' ? 'white' : '' }}
 
                >
 
                    Delivered
 
                </button>
 
            </div>
 
            {filteredOrders.length === 0 ? (
 
                <p className="no-orders">No orders found.</p>
 
            ) : (
 
                <>
 
                    <div className="orders-grid">
 
                        {currentOrders.map(order => (
 
                            <div key={order.orderId} className="order-card horizontal-card">
 
                                <div>
 
                                    <h4>Product: {order.productName}</h4>
 
                                    <p><strong>Order ID:</strong> {order.orderId}</p>
 
                                    <p><strong>Status:</strong> {order.status}</p>
 
                                    <p><strong>Product ID:</strong> {order.productId}</p>
 
                                    <p><strong>Description:</strong> {order.description}</p>
 
                                </div>
 
                                <div>
 
                                    <p><strong>Unit Price:</strong> ₹{order.unitPrice}</p>
 
                                    <p><strong>Ordered Quantity:</strong> {order.orderedQuantity}</p>
 
                                    <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
 
                                    {order.status !== 'Delivered' && (
 
                                        editId === order.orderId ? (
 
                                            <div className="update-status-section">
 
                                                <select
 
                                                    className="update-status-select stylish-dropdown"
 
                                                    value={newStatus}
 
                                                    onChange={(e) => setNewStatus(e.target.value)}
 
                                                >
 
                                                    <option value="">Select Status</option>
 
                                                    {filter === 'Placed' && <option value="Shipped">Shipped</option>}
 
                                                    {filter === 'Shipped' && <option value="Delivered">Delivered</option>}
 
                                                </select>
 
                                                <button
 
                                                    className="update-status-button styled-button"
 
                                                    onClick={() => handleUpdateStatus(order.orderId)}
 
                                                    style={{ backgroundColor: getButtonColor(newStatus) }}
 
                                                >
 
                                                    Update
 
                                                </button>
 
                                            </div>
 
                                        ) : (
 
                                            <button
 
                                                className="edit-status-button styled-button"
 
                                                onClick={() => setEditId(order.orderId)}
 
                                                style={{ backgroundColor: getButtonColor(order.status) }}
 
                                            >
 
                                                Update Status
 
                                            </button>
 
                                        )
 
                                    )}
 
                                </div>
 
                            </div>
 
                        ))}
 
                    </div>
 
                    {filteredOrders.length > ordersPerPage && (
 
                        <nav className="pagination">
 
                            <ul className="pagination-list">
 
                                {pageNumbers.map(number => (
 
                                    <li key={number} className={`pagination-item ${currentPage === number ? 'active' : ''}`}>
 
                                        <button onClick={() => paginate(number)} className="pagination-link styled-pagination-button">
 
                                            {number}
 
                                        </button>
 
                                    </li>
 
                                ))}
 
                            </ul>
 
                        </nav>
 
                    )}
 
                </>
 
            )}
 
            <ToastContainer position="bottom-right" autoClose={3000} />
 
            {showScrollUpButton && (
 
                <button onClick={scrollToTop} className="scroll-up-button">
 
                    <FaArrowUp />
 
                </button>
 
            )}
 
        </div>
 
    );
 
}
 
export default UpdateOrdersComponent;
 