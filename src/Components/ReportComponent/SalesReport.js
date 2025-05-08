import React, { useState } from 'react';
import axios from 'axios';
import './SalesReport.css'; // Import the CSS file
import ReactPaginate from 'react-paginate';

function SalesReport() {
    const [reportData, setReportData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(3); // Adjusted for card layout
    const [dynamicColor, setDynamicColor] = useState('#f0f0f0'); // Initial background color

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
        // Change background color on page change
        const hue = selected * 30; // Vary hue based on page number
        setDynamicColor(`hsl(${hue}, 30%, 95%)`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get('https://webapiproject-ffx8.onrender.com/api/Report/sales', {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            });
            setReportData(response.data);
            setCurrentPage(0); // Reset to the first page after fetching new data
        } catch (error) {
            console.error('Error fetching report:', error);
            // Optionally set an error message in state
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReportData = reportData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(reportData.length / itemsPerPage);

    return (
        <div className="sales-report-container card-layout-container" style={{ backgroundColor: dynamicColor }}>
            <div className="report-content card-layout-content">
                <h3 className="report-title">Sales Report</h3>
                <form onSubmit={handleSubmit} className="report-form">
                    <div className="form-group">
                        <label htmlFor="startDate" className="form-label">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate" className="form-label">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn report-button">Generate Report</button>
                </form>

                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : (
                    currentReportData.length === 0 && !loading ? (
                        <p className="no-data-text">No data found for the selected date range.</p>
                    ) : (
                        <div className="report-grid">
                            {currentReportData.map((item, index) => (
                                <div key={index} className="report-card">
                                    <h5 className="card-title">Product: {item.productName}</h5>
                                    <p className="card-info">Product ID: {item.productId}</p>
                                    {/* <p className="card-info">Quantity Sold: {item.quantitySold}</p> */}
                                    <p className="card-info">Total Sales: {item.totalSalesAmount}</p>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {reportData.length > itemsPerPage && (
                    <ReactPaginate
                        previousLabel="Previous"
                        nextLabel="Next"
                        breakLabel="..."
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination-container"
                        activeClassName="pagination-active"
                        pageClassName="pagination-page"
                        pageLinkClassName="pagination-link"
                        previousClassName="pagination-previous"
                        previousLinkClassName="pagination-previous-link"
                        nextClassName="pagination-next"
                        nextLinkClassName="pagination-next-link"
                        breakClassName="pagination-break"
                        breakLinkClassName="pagination-break-link"
                    />
                )}
            </div>
        </div>
    );
}

export default SalesReport;
