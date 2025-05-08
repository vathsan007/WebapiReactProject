import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomepageUser.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from './ProductCard';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
 
const HomepageUser = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();
    const [orderProductId, setOrderProductId] = useState(null);
    const [orderedQuantity, setOrderedQuantity] = useState('');
    const combinedCarouselRef = useRef(null);
    const [carouselPageIndex, setCarouselPageIndex] = useState(0);
    const numCarouselPages = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(3);
 
    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselPageIndex(prevIndex => (prevIndex) % numCarouselPages);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
 
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5203/api/Products');
            setProducts(response.data);
            setFilteredProducts(response.data);
            const uniqueCategories = Array.from(new Set(response.data.map(p => p.category)));
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products.');
        }
    };
 
    const handleSearch = () => {
        let filtered = products;
 
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
 
        if (category && category !== "") {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === category.toLowerCase()
            );
        }
 
        if (price) {
            filtered = filtered.filter(product =>
                product.unitPrice <= parseFloat(price)
            );
        }
 
        setFilteredProducts(filtered);
        setCurrentPage(1);
 
        if (filtered.length === 0) {
            toast.info('No products found matching your criteria.');
        }
    };
 
    const resetFilters = () => {
        setSearchTerm('');
        setCategory('');
        setPrice('');
        setFilteredProducts(products);
        setCurrentPage(1);
        toast.info('Filters cleared, showing all products.');
    };
 
    const initiatePlaceOrder = (productId) => {
        setOrderProductId(productId);
        setOrderedQuantity('');
    };
 
    const handleQuantityChange = (e) => {
        setOrderedQuantity(e.target.value);
    };
 
    const placeOrder = async () => {
        if (!orderedQuantity || parseInt(orderedQuantity) <= 0) {
            toast.error('Please enter a valid quantity.');
            return;
        }
 
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5203/api/Order',
                {
                    productId: orderProductId.trim(),
                    orderedQuantity: parseInt(orderedQuantity),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setOrderProductId(null);
            setOrderedQuantity('');
            toast.success('Order placed successfully!');
            navigate('/payment');
        } catch (error) {
            console.error('Error placing order:', error);
            if (error.response) {
                toast.error(`Failed to place order: ${error.response.data}`);
            } else if (error.request) {
                toast.error('Failed to place order: No response from server');
            } else {
                toast.error(`Failed to place order: ${error.message}`);
            }
        }
    };
 
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
 
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
    // Auto carousel movement corrected version
    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselPageIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % numCarouselPages;
                goToCarouselPage(nextIndex);
                return nextIndex;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);
 
    const goToCarouselPage = (index) => {
        if (combinedCarouselRef.current) {
            const containerWidth = combinedCarouselRef.current.offsetWidth;
            combinedCarouselRef.current.scrollTo({
                left: index * containerWidth,
                behavior: 'smooth',
            });
        }
    };
 
    return (
        <div className="homepage-container">
            <div className="carousel-cardd">
                <h2 className='hi'>Welcome to our Inventory Management System!</h2>
                <p>Explore a curated selection of our top products and discover seamless ordering.</p>
            </div>
 
            <div className="search-filters-container">
                <div className="search-filters">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <button className="search-icon-button" onClick={handleSearch}>
                        <FaSearch />
                    </button>
                    {/* <button onClick={handleSearch}>Search</button> */}
                 
                </div>
            </div>
 
            <div className="combined-carousel-container">
        <div
            className="combined-carousel-track"
            style={{
                transform: `translateX(-${carouselPageIndex * 100}%)`,
            }}
        >
            {[
                {
                    title: "Effortless Inventory at Your Fingertips",
                    content: "Browse our extensive catalog with ease and place orders in just a few clicks."
                },
                {
                    title: "Your Central Hub for Product Ordering",
                    content: "Find the products you need quickly and efficiently with our intuitive system."
                },
                {
                    title: "Why Choose Our Platform?",
                    content: "Experience streamlined ordering and efficient inventory management."
                },
                {
                    title: "Real-time Inventory Insights",
                    content: "Stay informed with up-to-date availability and product details."
                }
            ].map((slide, i) => (
                <div className="carousel-section" key={i}>
                    <div className="carousel-card">
                        <h2>{slide.title}</h2>
                        <p>{slide.content}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="carousel-pagination">
            {Array.from({ length: numCarouselPages }, (_, i) => (
                <button
                    key={i}
                    className={carouselPageIndex === i ? 'active' : ''}
                    onClick={() => setCarouselPageIndex(i)}
                >
                    {}
                </button>
            ))}
        </div>
    </div>
            <h1>Product List</h1>
 
            <div className="product-grid">
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                        orderProductId={orderProductId}
                        orderedQuantity={orderedQuantity}
                        onQuantityChange={handleQuantityChange}
                        onInitiateOrder={initiatePlaceOrder}
                        onPlaceOrder={placeOrder}
                    />
                ))}
            </div>
 
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
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
 
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};
 
export default HomepageUser;
 
 