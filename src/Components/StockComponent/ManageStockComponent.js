import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageStockComponent.css'; // Import CSS file
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

function ManageStockComponent() {
    const [stocks, setStocks] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const stocksPerPage = 2; // You can adjust this number

    const fetchStocks = () => {
        axios.get('https://webapiproject-ffx8.onrender.com/api/Stock/AllStock')
            .then(res => setStocks(res.data))
            .catch(() => toast.error('Failed to fetch stock data'));
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleQuantityChange = (productId, value) => {
        // Allow only positive integer input
        const intValue = parseInt(value, 10);
        if (value === '' || (!isNaN(intValue) && intValue >= 0 && value === intValue.toString())) {
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: value
            }));
        } else if (!isNaN(intValue) && intValue < 0) {
             toast.error('Quantity cannot be negative.');
             // Optionally clear the input field for this product
             setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: ''
            }));
        } else {
             toast.error('Please enter a valid number for quantity.');
              // Optionally clear the input field for this product
             setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: ''
            }));
        }
    };


    const handleAddStock = (productId) => {
        const quantity = quantities[productId];
        // Convert quantity to a number for validation
        const quantityValue = Number(quantity);

        // --- Added Validation Check for positive quantity ---
        if (!quantity || quantity === '') {
            toast.error('Please enter a quantity.');
            return; // Stop if no quantity is entered
        }
        if (isNaN(quantityValue) || quantityValue <= 0) {
            toast.error('Quantity must be a positive number.');
            // Optional: Clear the invalid input field
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: ''
            }));
            return; // Stop if quantity is not a positive number
        }
 

        axios.post(`https://webapiproject-ffx8.onrender.com/api/Stock/AddStock?productId=${productId}&quantity=${quantity}`)
            .then(() => {
                toast.success('Stock added successfully');
                setQuantities(prevQuantities => ({
                    ...prevQuantities,
                    [productId]: ''
                }));
                fetchStocks(); // Refresh stock list
            })
            .catch(() => toast.error('Failed to add stock. Please try again')); 
    };

    const handleReduceStock = (productId) => {
        const quantity = quantities[productId];
        // Convert quantity to a number for validation
        const quantityValue = Number(quantity);

        // Find the stock item to get its current available quantity
        const stockItem = stocks.find(s => s.productId === productId);
        // Use 0 if stockItem is not found, though fetchStocks should prevent this usually
        const availableQuantity = stockItem ? stockItem.availableQuantity : 0;

        if (!quantity || quantity === '') {
            toast.error('Please enter a quantity.');
            return; // Stop if no quantity is entered
        }
        if (isNaN(quantityValue) || quantityValue <= 0) {
            toast.error('Quantity must be a positive number.');
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: ''
            }));
            return; // Stop if quantity not positive number
        }

        if (availableQuantity < quantityValue) {
            toast.error(`Cannot reduce stock by ${quantityValue}. Only ${availableQuantity} available.`);

            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: ''
            }));
            return; // Stop if not enough stock
        }


        axios.post(`https://webapiproject-ffx8.onrender.com/api/Stock/ReduceStock?productId=${productId}&quantity=${quantity}`)
            .then(() => {
                toast.success('Stock reduced successfully');
                setQuantities(prevQuantities => ({
                    ...prevQuantities,
                    [productId]: ''
                }));
                fetchStocks(); // Refresh
            })
            .catch((error) => {
                console.error('Failed to reduce stock API error:', error);
                 toast.error('Failed to reduce stock due to an error.');
            });
    };

    const handleDiscardStock = (productId) => {
        // Find the stock item to get its current available quantity
        const stockItem = stocks.find(s => s.productId === productId);
        const availableQuantity = stockItem ? stockItem.availableQuantity : 0; // Handle case where stockItem might not be found

        if (availableQuantity === 0) {
            toast.error('No more stock left to discard.');
            return; // Stop here if stock is already zero
        }

        axios.post(`https://webapiproject-ffx8.onrender.com/api/Stock/DiscardAllStock?productId=${productId}`)
            .then(() => {
                toast.success('Stock discarded successfully');
                // No quantity state to clear here as input is for Add/Reduce
                fetchStocks(); // Refresh stock list
            })
            .catch((error) => {
                console.error('Failed to discard stock:', error);
                // Provide a more user-friendly error if possible, e.g., check error.response.data
                 toast.error('Failed to discard stock. Product ID may be invalid or an error occurred.');
            });
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setCurrentPage(1);
        if (newSearchTerm.length > 0) {
            const suggestions = stocks
                .filter(stock =>
                    stock.productName.toLowerCase().includes(newSearchTerm.toLowerCase())
                )
                .map(stock => stock.productName);
            setSearchSuggestions(suggestions);
            setIsDropdownVisible(true);
        } else {
            setSearchSuggestions([]);
            setIsDropdownVisible(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setIsDropdownVisible(false);
    };

    // Pagination logic
    const indexOfLastStock = currentPage * stocksPerPage;
    const indexOfFirstStock = indexOfLastStock - stocksPerPage;
    const filteredStocks = stocks.filter(stock =>
        stock.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentStocks = filteredStocks.slice(indexOfFirstStock, indexOfLastStock);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredStocks.length / stocksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='addstock'>
            <div className="add-stock-container stylish-container">
                <ToastContainer autoClose={3000} position='bottom-right' />

                <div className="search-container">
                    {/* <p className="add-stock-title">Manage Stock</p> */}
                    <input
                        type="text"
                        placeholder="Search by product name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar stylish-input"
                        onFocus={() => setIsDropdownVisible(searchTerm.length > 0 && searchSuggestions.length > 0)}
                        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)} // Slight delay for click
                    />
                    {isDropdownVisible && searchSuggestions.length > 0 && (
                        <ul className="search-dropdown">
                            {searchSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="search-suggestion-item"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <section className="stock-list-section stylish-card">
                    {/* <p className="add-stock-title">Manage Stock</p> */}
                    <h3>Current Stock Levels</h3>
                    <div className="stock-list">
                        {currentStocks.map(stock => (
                            <div key={stock.productId} className="stock-item">
                                <h4>Product Name: {stock.productName}</h4>
                                <p><strong>Product ID:</strong> {stock.productId}</p>
                                <p><strong>Available Quantity:</strong> {stock.availableQuantity}</p>
                                <div className="form-group">
                                    <label htmlFor={`quantity-${stock.productId}`} className="form-label">Quantity:</label>
                                    <input
                                        type="number" // Use type="number" for better mobile keyboards and basic validation
                                        id={`quantity-${stock.productId}`}
                                        className="form-input stylish-input"
                                        placeholder="Enter Quantity"
                                        value={quantities[stock.productId] || ''}
                                        onChange={e => handleQuantityChange(stock.productId, e.target.value)}
                                        min="1" // Add min attribute for basic browser validation hint
                                    />
                                </div>
                                <div className="stock-actions">
                                    <button onClick={() => handleAddStock(stock.productId)} className="add-stock-button stylish-button">Add</button>
                                    <button onClick={() => handleReduceStock(stock.productId)} className="reduce-stock-button stylish-button">Reduce</button>
                                    <button onClick={() => handleDiscardStock(stock.productId)} className="discard-stock-button stylish-button">Discard</button>
                                </div>
                            </div>
                        ))}
                        {filteredStocks.length === 0 && <p className="no-stock-message">No stock data available.</p>}
                    </div>
                    {filteredStocks.length > stocksPerPage && (
                        <nav className="pagination">
                            <ul className="pagination-list">
                                {pageNumbers.map((number) => (
                                    <li
                                        key={number}
                                        className={`pagination-item ${currentPage === number ? 'active' : ''}`}
                                    >
                                        <button onClick={() => paginate(number)} className="pagination-link stylish-pagination-button">
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </section>
            </div>
        </div>
    );
}

export default ManageStockComponent;