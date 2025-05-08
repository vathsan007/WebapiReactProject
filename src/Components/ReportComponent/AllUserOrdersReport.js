import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllUserOrdersReport.css";
import ReactPaginate from "react-paginate";
import { FaArrowUp } from "react-icons/fa"; // Import the up arrow icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS


const AllUserOrdersReport = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(6);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);

    useEffect(() => {
        fetchOrderHistory();

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

    const fetchOrderHistory = async () => {
        let token;
        try {
            token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication token not found. Please log in."); 
                throw new Error("Token not found");
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
            return; // Stop execution if token is not found
        }

        try {
            const response = await axios.get(
                "http://localhost:5203/api/Report/order-history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrderHistory(response.data);
            setFilteredOrders(response.data);

        } catch (error) {
            console.error("Error fetching order history:", error);
            toast.error("Failed to fetch order history."); 
        }
    };

    const handleFilter = () => {
        let filtered = orderHistory;

        if (startDate) {
            filtered = filtered.filter(
                (order) => new Date(order.orderDate) >= new Date(startDate)
            );
        }

        if (endDate) {
            filtered = filtered.filter(
                (order) => new Date(order.orderDate) <= new Date(endDate)
            );
        }

        if (status) {
            filtered = filtered.filter(
                (order) => order.status.toLowerCase().includes(status.toLowerCase()) // Using includes for partial match
            );
             if (filtered.length === 0) {
                toast.info("No orders found matching the filter criteria.");
            } else {
                toast.success(`${filtered.length} orders found.`);
            }
        } else {
             if (filtered.length === 0 && (startDate || endDate)) {
                toast.info("No orders found within the selected date range.");
             } else if (filtered.length > 0 && (startDate || endDate)) {
                toast.success(`${filtered.length} orders found within the date range.`);
             }
        }


        setFilteredOrders(filtered);
        setCurrentPage(0); // Reset to first page after filtering
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

    const getStatusCounts = () => {
        const statusCounts = {
            placed: 0,
            shipped: 0,
            delivered: 0,
            canceled: 0,
        };

        filteredOrders.forEach((order) => {
            const status = order.status.toLowerCase();
            if (statusCounts[status] !== undefined) {
                statusCounts[status]++;
            }
             // Handle other potential statuses if necessary
        });

        return statusCounts;
    };

    const getStatusColorClass = (status) => {
        const lowerCaseStatus = status.toLowerCase();
        switch (lowerCaseStatus) {
            case "placed":
                return "status-placed";
            case "shipped":
                return "status-shipped";
            case "delivered":
                return "status-delivered";
            case "canceled": 
            case "cancelled": 
                return "status-cancelled";
            default:
                return "";
        }
    };

    const statusCounts = getStatusCounts(); // This variable is calculated but not used in the returned JSX

    return (
        <div className="order-report-container">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <h2 className="report-title">Order History</h2>

            <div className="filter-section">
                <div className="filter-input">
                    <label className="filter-label">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="filter-control"
                    />
                </div>
                <div className="filter-input">
                    <label className="filter-label">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="filter-control"
                    />
                </div>
                <div className="filter-input">
                    <label className="filter-label">Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="filter-control"
                        placeholder="Enter status"
                    />
                </div>
                <button onClick={handleFilter} className="filter-button">
                    Filter
                </button>
            </div>
            <div className="order-grid">
                {currentOrders.map((order) => (
                    <div className="order-card" key={order.orderId}>
                        <h5 className="card-order-id">Order ID: {order.orderId}</h5>
                        <p className="card-info">User ID: {order.userId}</p>
                        <p className="card-info">Product ID: {order.productId}</p>
                        <p className="card-info">Quantity: {order.orderedQuantity}</p>
                        <p className="card-info">
                            Date: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <p
                            className={`card-status ${getStatusColorClass(order.status)}`}
                        >
                            Status: {order.status}
                        </p>
                    </div>
                ))}
                {currentOrders.length === 0 && filteredOrders.length === 0 && (startDate || endDate || status) && (
                     <p className="no-orders">
                        No orders found based on the applied filters.
                     </p>
                )}
                 {orderHistory.length === 0 && !startDate && !endDate && !status && (
                      <p className="no-orders">
                         No order history available.
                      </p>
                 )}
            </div>
            {filteredOrders.length > itemsPerPage && (
                <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                />
            )}

            {showScrollUpButton && (
                <button onClick={scrollToTop} className="scroll-up-button">
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default AllUserOrdersReport;