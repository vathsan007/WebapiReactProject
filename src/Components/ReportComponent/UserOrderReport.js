import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserOrderReport() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(3);
    const [filter, setFilter] = useState('Placed');

    // Modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null); // Store the orderId to cancel

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5203/api/Report/user-order-details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
            setCurrentPage(1); // Reset to page 1 on fetch/filter change
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        }
    };

    // Trigger the confirmation modal
    const initiateCancelOrder = (orderId) => {
        setOrderToCancel(orderId); // Store the ID
        setShowConfirmModal(true); // Show the modal
    };

    // Handle confirmation action
    const handleConfirmCancel = async () => {
        setShowConfirmModal(false); // Hide the modal
        const token = localStorage.getItem('token');

        if (!orderToCancel) {
             toast.warn("No order selected for cancellation.");
             return;
        }

        try {
            await axios.delete(`http://localhost:5203/api/Order/${orderToCancel}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(`Order ${orderToCancel} cancelled successfully`);
            fetchOrders(); // Refresh orders
        } catch (error) {
            console.error('Error cancelling order:', error);
            // Added basic error message from response if available
            if (error.response && error.response.data) {
                 toast.error(`Failed to cancel order: ${error.response.data}`);
             } else {
                toast.warn('Failed to cancel the order');
            }
        } finally {
             setOrderToCancel(null); // Clear the stored ID
        }
    };

    // Handle closing the modal
    const handleCloseConfirm = () => {
        setShowConfirmModal(false); // Hide the modal
        setOrderToCancel(null); // Clear the stored ID
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Placed':
                return 'info';
            case 'Cancelled':
                return 'danger';
            case 'Delivered':
                return 'success';
            case 'Shipped':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Order History</h2>
            <div className="d-flex justify-content-center mb-3">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-${filter === 'Placed' ? getStatusColor('Placed') : 'primary'} ${filter === 'Placed' ? 'active' : ''}`}
                        onClick={() => setFilter('Placed')}
                    >
                        Placed
                    </button>
                    <button
                        className={`btn btn-outline-${filter === 'Cancelled' ? getStatusColor('Cancelled') : 'primary'} ${filter === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('Cancelled')}
                    >
                        Cancelled
                    </button>
                    <button
                        className={`btn btn-outline-${filter === 'Delivered' ? getStatusColor('Delivered') : 'primary'} ${filter === 'Delivered' ? 'active' : ''}`}
                        onClick={() => setFilter('Delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={`btn btn-outline-${filter === 'Shipped' ? getStatusColor('Shipped') : 'primary'} ${filter === 'Shipped' ? 'active' : ''}`}
                        onClick={() => setFilter('Shipped')}
                    >
                        Shipped
                    </button>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {currentOrders.length === 0 ? (
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text text-muted">No orders found with the current filter.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    currentOrders.map(order => (
                        <div key={order.orderId} className="col">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Product: {order.productName}</h5>
                                    <p className="card-text"><strong>Ordered Quantity:</strong> {order.orderedQuantity}</p>
                                    <p className="card-text"><strong>Price: </strong><span>₹</span>{(order.orderedQuantity * order.unitPrice).toFixed(2)}</p>
                                    <p className="card-text">
                                        <strong>Status:</strong>{' '}
                                        <span className={`badge bg-${getStatusColor(order.status)}`}>{order.status}</span>
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Date: {new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </small>
                                    </p>
                                    {order.status === 'Placed' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => initiateCancelOrder(order.orderId)} // Call the new trigger function
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {filteredOrders.length > ordersPerPage && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <button onClick={() => paginate(number)} className="page-link">
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>Next</button>
                        </li>
                    </ul>
                </nav>
            )}

            {showConfirmModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">Confirm Cancellation</h5>
                                <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCloseConfirm}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to cancel order <strong>{orderToCancel}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseConfirm}>No, Keep Order</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmCancel}>Yes, Cancel Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" autoClose={2000} />
        </div>
    );
}

export default UserOrderReport;