import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Form, Button, Row, Col, Table, Modal, Dropdown } from 'react-bootstrap';
import './AddSupplierComponent.css'; // Import combined CSS

const API_URL = 'https://webapiproject-ffx8.onrender.com/api/Supplier';
const SUPPLIERS_PER_PAGE = 5;

function AddSupplierComponent() {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({
        supplierId: 1,
        supplierName: '',
        phone: '',
        email: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [editFormData, setEditFormData] = useState({
        supplierId: '',
        supplierName: '',
        phone: '',
        email: ''
    });
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                setSuppliers(response.data);
                if (response.data.length > 0) {
                    const lastSupplierId = response.data[response.data.length - 1].supplierId;
                    setNewSupplier(prevState => ({ ...prevState, supplierId: lastSupplierId + 1 }));
                } else {
                    setNewSupplier(prevState => ({ ...prevState, supplierId: 1 }));
                }
            } else {
                setError(`Failed to load suppliers. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setError(`Failed to load suppliers: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSupplier({ ...newSupplier, [name]: value });
    };

    const validateSupplierName = (name) => {
        if (!/^[A-Z]/.test(name)) return 'Name should start with a capital letter.';
        if (/^[^A-Za-z]+/.test(name)) return 'Name should not start with a special character or number.';
        if (name.length < 6) return 'Name should have a minimum of 6 letters.';
        return '';
    };

    const validatePhoneNumber = (phone) => {
        if (!/^[0-9]{10}$/.test(phone)) return 'Phone number must be exactly 10 digits.';
        return '';
    };

    const validateEmail = (email) => {
        if (/^[0-9\W]+/.test(email)) return 'Email should not start with a number or special character.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameError = validateSupplierName(newSupplier.supplierName);
        const phoneError = validatePhoneNumber(newSupplier.phone);
        const emailError = validateEmail(newSupplier.email);

        if (nameError || phoneError || emailError) {
            if (nameError) toast.error(nameError);
            if (phoneError) toast.error(phoneError);
            if (emailError) toast.error(emailError);
            return;
        }

        try {
            const response = await axios.post(API_URL, newSupplier, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                toast.success('Supplier added successfully!');
                setNewSupplier({ supplierId: 0, supplierName: '', phone: '', email: '' });
                fetchSuppliers();
            } else if (response.status === 409) {
                toast.error('Supplier with same name or email already exists!');
            } else {
                toast.error('Failed to save supplier.');
            }
        } catch (err) {
            console.error('Error saving supplier:', err);
            if (err.response && err.response.status === 409) {
                toast.error('Supplier with same name or email already exists!');
            } else {
                toast.error('Failed to save supplier.');
            }
        }
    };

    const indexOfLastSupplier = currentPage * SUPPLIERS_PER_PAGE;
    const indexOfFirstSupplier = indexOfLastSupplier - SUPPLIERS_PER_PAGE;
    const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);
    const totalPages = Math.ceil(suppliers.length / SUPPLIERS_PER_PAGE);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const pageNumbers = [...Array(totalPages).keys()].map(number => number + 1);

    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditFormData({ ...supplier });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedSupplier(null);
        setEditFormData({ supplierId: '', supplierName: '', phone: '', email: '' });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateSupplier = async (e) => {
        e.preventDefault();

        const nameError = validateSupplierName(editFormData.supplierName);
        const phoneError = validatePhoneNumber(editFormData.phone);
        const emailError = validateEmail(editFormData.email);

        if (nameError || phoneError || emailError) {
            if (nameError) toast.error(nameError);
            if (phoneError) toast.error(phoneError);
            if (emailError) toast.error(emailError);
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/${editFormData.supplierId}`, editFormData);
            if (response.status === 200) {
                toast.success('Supplier updated successfully!');
                handleCloseEditModal();
                fetchSuppliers();
            } else if (response.status === 409) {
                toast.error('Supplier with same name or email already exists!');
            } else {
                toast.error('Failed to update supplier.');
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            if (error.response && error.response.status === 409) {
                toast.error('Supplier with same name or email already exists!');
            } else {
                toast.error('Failed to update supplier.');
            }
        }
    };

    const handleDeleteClick = (supplier) => {
        setSupplierToDelete(supplier);
        setDeleteConfirmationVisible(true);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
        setSupplierToDelete(null);
    };

    const confirmDeleteSupplier = async () => {
        if (!supplierToDelete) return;

        try {
            const response = await axios.delete(`${API_URL}/${supplierToDelete.supplierId}`);
            if (response.status === 200) {
                toast.success('Supplier deleted successfully!');
                fetchSuppliers();
            } else {
                toast.error('Failed to delete supplier.');
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
            toast.error('Failed to delete supplier.');
        } finally {
            handleCloseDeleteConfirmation();
        }
    };

    if (loading) {
        return <Container className="mt-5"><p>Loading suppliers...</p></Container>;
    }

    if (error) {
        return <Container className="mt-5"><p className="text-danger">{error}</p></Container>;
    }

    return (
        <Container className="mt-5 supplier-management-container">
            <ToastContainer />
            <Row>
                <Col md={6} className="add-supplier-section">
                    <div className="add-supplier-card">
                        <h2 className="card-title mb-4 text-center">Add New Supplier</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Supplier ID</Form.Label>
                                <Form.Control type="text" name="supplierId" value={newSupplier.supplierId} readOnly className="form-control-sm" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control type="text" name="supplierName" placeholder="Supplier Name" value={newSupplier.supplierName} onChange={handleInputChange} required className="form-control-sm" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" name="phone" placeholder="Phone" value={newSupplier.phone} onChange={handleInputChange} required className="form-control-sm" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Email" value={newSupplier.email} onChange={handleInputChange} required className="form-control-sm" />
                            </Form.Group>
                            <div className="d-grid">
                                <Button variant="primary" type="submit" className="btn-sm add-supplier-button">
                                    Add Supplier
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col md={6} className="all-suppliers-section">
                    <div className="supplier-list-container">
                        <h2> Suppliers</h2>
                        {suppliers.length === 0 ? (
                            <p>No suppliers found.</p>
                        ) : (
                            <>
                                <Table striped bordered hover className="supplier-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentSuppliers.map(supplier => (
                                            <tr key={supplier.supplierId}>
                                                <td>{supplier.supplierId}</td>
                                                <td>{supplier.supplierName}</td>
                                                <td>{supplier.phone}</td>
                                                <td>{supplier.email}</td>
                                                <td>
                                                    <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditClick(supplier)}>
                                                        Edit
                                                    </Button>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="danger" size="sm" id={`dropdown-delete-${supplier.supplierId}`}>
                                                            Delete
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => handleDeleteClick(supplier)}>
                                                                Confirm Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
                                            Previous
                                        </Button>
                                        {pageNumbers.map(number => (
                                            <Button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                            >
                                                {number}
                                            </Button>
                                        ))}
                                        <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSupplier}>
                        <Form.Group className="mb-3">
                            <Form.Label>Supplier ID</Form.Label>
                            <Form.Control type="text" value={editFormData.supplierId} readOnly className="form-control-sm" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Supplier Name</Form.Label>
                            <Form.Control type="text" name="supplierName" placeholder="Supplier Name" value={editFormData.supplierName} onChange={handleEditInputChange} required className="form-control-sm" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" name="phone" placeholder="Phone" value={editFormData.phone} onChange={handleEditInputChange} required className="form-control-sm" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Email" value={editFormData.email} onChange={handleEditInputChange} required className="form-control-sm" />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary" type="submit" className="btn-sm">
                                Update Supplier
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal} className="btn-sm">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteConfirmationVisible} onHide={handleCloseDeleteConfirmation}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {supplierToDelete && (
                        <p>Are you sure you want to delete supplier: <strong>{supplierToDelete.supplierName}</strong> (ID: {supplierToDelete.supplierId})?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation} className="btn-sm">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteSupplier} className="btn-sm">
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AddSupplierComponent;