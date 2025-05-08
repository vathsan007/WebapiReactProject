import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddProductComponent.css';
import { ToastContainer,toast } from 'react-toastify';

const API_URL = 'https://webapiproject-ffx8.onrender.com/api/Products';

const AddProductComponent = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        description: '',
        category: '',
        availableQuantity: '',
        unitPrice: '',
        supplierId: '',
        image: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;
    const [existingCategories, setExistingCategories] = useState([]);
    const [existingSupplierIds, setExistingSupplierIds] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);

            // Calculate the next product ID here when fetching products initially or refreshing
            const highestProductId = response.data.reduce((maxId, product) => {
                // Safely parse the numeric part after 'p'
                const numericPart = product.productId.replace(/^p/i, ''); // Remove 'p' or 'P' at the start
                const numericId = parseInt(numericPart, 10);
                if (!isNaN(numericId)) { // Check if parsing was successful
                    return numericId > maxId ? numericId : maxId;
                }
                return maxId; // Ignore invalid ProductIds for calculating the next one
            }, 0);

            const nextProductId = `p${String(highestProductId + 1).padStart(3, '0')}`;

            // Only pre-fill the productId if we are *adding* a new product and it's currently empty
            // When handleAddButtonClick is called, it resets formData, so productId will be ''
            setFormData(prev => {
                if (prev.productId === '') {
                   return { ...prev, productId: nextProductId };
                }
                return prev; // Don't overwrite if it already has a value (like when editing)
            });


            // Extract existing categories and supplier IDs
            const categories = [...new Set(response.data.map(p => p.category).filter(cat => cat))]; // Filter out null/undefined
            setExistingCategories(categories);
            const supplierIds = [...new Set(response.data.map(p => p.supplierId).filter(id => id != null))]; // Filter out null/undefined
            setExistingSupplierIds(supplierIds);

        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.value }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when search term changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for unit price
        if (parseFloat(formData.unitPrice) < 0) {
            toast.warn('Unit price cannot be negative.');
            return;
        }

        // Basic validation for required fields before sending
         if (!formData.productId || !formData.productName || !formData.category || !formData.unitPrice || !formData.supplierId || (!editingProduct && !formData.availableQuantity)) {
             toast.warn('Please fill in all required fields.');
             return;
         }


        try {
            const token = localStorage.getItem('token');
            if (editingProduct) {
                const updatePayload = { ...formData };
                 // Keep availableQuantity in the payload for update based on your backend SP accepting quantityAdded
                 // If your SP expects 'quantityAdded' separately, you might need to adjust this.
                 // Let's assume for edit, you send the current available quantity or the SP ignores it if quantityAdded is null
                 // Based on your SP UpdateProduct, it seems quantityAdded is used to *increment* the current stock.
                 // So for a standard edit where you just change name/price etc., you shouldn't send quantityAdded.
                 // If the edit form allows adding stock, you'd need a separate input for that quantity.
                 // Sticking to your original logic: removing availableQuantity for update payload
                 delete updatePayload.availableQuantity;


                await axios.put(`${API_URL}/${formData.productId}`, updatePayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Product updated successfully'); // Changed from setToastMessage/setShowToast to toast.success
            } else {
                await axios.post(API_URL, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success('Product added successfully'); // Changed from setToastMessage/setShowToast to toast.success
            }
            // Reset form and state after successful submission
            setFormData({
                productId: '',
                productName: '',
                description: '',
                category: '',
                availableQuantity: '',
                unitPrice: '',
                supplierId: '',
                image: ''
            });
            setEditingProduct(null);
            setIsAdding(false);
            fetchProducts(); // Refresh the product list and get the next ID
            // setShowToast(true); // Removed, toastify handles display
            // setTimeout(() => setShowToast(false), 3000); // Removed
        } catch (error) {
            console.error('Error submitting product:', error);
             // Attempt to get a more specific error message from the backend
             if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                 let errorMessages = 'Validation errors: ';
                 for (const field in validationErrors) {
                     if (validationErrors.hasOwnProperty(field)) {
                         errorMessages += `${field}: ${validationErrors[field].join(', ')} `;
                     }
                 }
                 toast.error(errorMessages.trim());
            } else if (error.response && error.response.data) {
                 toast.error(`Failed to submit product: ${error.response.data}`);
             }
             else {
                toast.error('Failed to submit product.');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productId: product.productId,
            productName: product.productName,
            description: product.description,
            category: product.category,
            availableQuantity: product.availableQuantity,
            unitPrice: product.unitPrice,
            supplierId: product.supplierId,
            image: product.image || ''
        });
        setIsAdding(true); // Open the form in edit mode
    };

    const handleDelete = (productId) => {
        setDeleteConfirmationId(productId);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${deleteConfirmationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Product deleted successfully'); 
            fetchProducts();
            // setShowToast(true); // Removed
            // setTimeout(() => setShowToast(false), 3000); // Removed
            setDeleteConfirmationId(null);
        } catch (error) {
            console.error('Error deleting product:', error);
             if (error.response && error.response.data) {
                 toast.error(`Failed to delete product: ${error.response.data}`);
             } else {
                toast.error('Failed to delete product');
             }
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmationId(null);
    };

    const handleAddButtonClick = () => {
        setIsAdding(true);
        setEditingProduct(null);
        // Reset formData to initial state and trigger fetchProducts to get the next ID suggestion
        setFormData({
            productId: '', // Reset productId to trigger fetchProducts to suggest the next one
            productName: '',
            description: '',
            category: '',
            availableQuantity: '',
            unitPrice: '',
            supplierId: '',
            image: ''
        });
        fetchProducts(); // To ensure the next product ID is up-to-date and sets the initial value
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setEditingProduct(null);
         // Reset form data when cancelling
        setFormData({
            productId: '',
            productName: '',
            description: '',
            category: '',
            availableQuantity: '',
            unitPrice: '',
            supplierId: '',
            image: ''
        });
    };

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchTerm.toLowerCase()) || // Also search by Product ID
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) || // Also search by Category
        (product.supplierId && product.supplierId.toString().includes(searchTerm.toLowerCase())) // Also search by Supplier ID
        // Add SupplierName search if it's available in the product object from the API
        // || (product.supplierName && product.supplierName.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        // Show a limited number of page numbers around the current page
        const maxPageNumbersToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

        // Adjust startPage if endPage is the totalPages but we couldn't show maxPageNumbersToShow
         const adjustedStartPage = Math.max(1, endPage - maxPageNumbersToShow + 1);


        for (let i = adjustedStartPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <nav>
                <ul className="pagination justify-content-center mt-3">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button onClick={() => paginate(currentPage - 1)} className="page-link" disabled={currentPage === 1}>Previous</button>
                    </li>
                    {/* Render start ellipsis if needed */}
                    {adjustedStartPage > 1 && (
                        <li className="page-item disabled">
                             <span className="page-link">...</span>
                        </li>
                    )}

                    {pageNumbers.map(number => (
                        <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                            <button onClick={() => paginate(number)} className="page-link">{number}</button>
                        </li>
                    ))}

                     {/* Render end ellipsis if needed */}
                     {endPage < totalPages && (
                        <li className="page-item disabled">
                             <span className="page-link">...</span>
                        </li>
                    )}


                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button onClick={() => paginate(currentPage + 1)} className="page-link" disabled={currentPage === totalPages}>Next</button>
                    </li>
                </ul>
            </nav>
        );
    };

    return (
        <div className="container mt-4">
            {/* ToastContainer is correctly placed here */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2>All Products</h2>
                <button onClick={handleAddButtonClick} className="btn btn-primary">Add New Product</button>
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search by product name, ID, category, or supplier ID" // Updated placeholder
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Product Table */}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Image</th>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Supplier</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Display current page products */}
                    {currentProducts.map(product => (
                        <tr key={product.productId}>
                            <td className="product-image-cell">
                                {product.image && <img src={product.image} alt={product.productName} className="product-image-table-small img-thumbnail" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />} {/* Added object-fit */}
                            </td>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{product.availableQuantity}</td>
                            <td>₹{product.unitPrice}</td>
                             {/* Display supplier ID and Name if available from API */}
                            <td>{product.supplierId} {product.supplierName ? `(${product.supplierName})` : ''}</td>
                            <td>
                                <button onClick={() => handleEdit(product)} className="btn btn-sm btn-info me-2">Edit</button>
                                <button onClick={() => handleDelete(product.productId)} className="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                     {/* Message if no products found after filtering */}
                    {filteredProducts.length === 0 && (
                         <tr>
                            <td colSpan="9" className="text-center">No products found matching your search.</td>
                         </tr>
                    )}
                     {/* Message if no products at all */}
                     {products.length === 0 && !searchTerm && (
                          <tr>
                            <td colSpan="9" className="text-center">No products available.</td>
                         </tr>
                     )}
                </tbody>
            </table>

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && renderPageNumbers()}

            {/* Add/Edit Product Modal */}
            {isAdding && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
                                <button type="button" className="btn-close" onClick={handleCancelAdd}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label htmlFor="productId" className="form-label">Product ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="productId"
                                                name="productId"
                                                value={formData.productId}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="productName" className="form-label">Product Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="productName"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                list="categoryOptions"
                                            />
                                            <datalist id="categoryOptions">
                                                {existingCategories.map(cat => (
                                                    <option key={cat} value={cat} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required />
                                        </div>
                                        {/* Available Quantity is only required/shown when adding */}
                                        {!editingProduct && (
                                            <div className="col-md-3">
                                                <label htmlFor="availableQuantity" className="form-label">Available Quantity</label>
                                                <input type="number" className="form-control" id="availableQuantity" name="availableQuantity" value={formData.availableQuantity} onChange={handleChange} required />
                                            </div>
                                        )}
                                         {/* Allow editing Available Quantity if needed, maybe in a separate field or flow */}


                                        <div className="col-md-3">
                                            <label htmlFor="unitPrice" className="form-label">Unit Price</label>
                                            <div className="input-group">
                                                <span className="input-group-text">₹</span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="unitPrice"
                                                    name="unitPrice"
                                                    value={formData.unitPrice}
                                                    onChange={handleChange}
                                                    required
                                                    step="0.01" // Added step for currency
                                                    min="0" // Added min validation here too
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="supplierId" className="form-label">Supplier ID</label>
                                            <input
                                                type="text" // Changed to text because supplier ID can be string 'supXYZ' or number
                                                className="form-control"
                                                id="supplierId"
                                                name="supplierId"
                                                value={formData.supplierId}
                                                onChange={handleChange}
                                                required
                                                list="supplierIdOptions"
                                            />
                                            <datalist id="supplierIdOptions">
                                                {existingSupplierIds.map(supId => (
                                                    <option key={supId} value={supId} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="col-md-8">
                                            <label htmlFor="image" className="form-label">Image URL</label>
                                            <input type="text" className="form-control" id="image" name="image" value={formData.image} onChange={handleImageChange} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                                        {/* The close button on the modal header serves as cancel */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmationId && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete product ID: <strong>{deleteConfirmationId}</strong>?</p> {/* Emphasized ID */}
                            </div>
                            <div className="modal-footer">
                                <button onClick={cancelDelete} className="btn btn-secondary">Cancel</button>
                                <button onClick={confirmDelete} className="btn btn-danger">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

             {/*
            {showToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div className="toast bg-success text-white fade show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-body">
                            {toastMessage}
                        </div>
                    </div>
                </div>
            )}
             */}
        </div>
    );
};

export default AddProductComponent;