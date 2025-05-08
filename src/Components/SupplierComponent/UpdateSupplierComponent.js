import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./UpdateSupplierComponent.css"; // Import the CSS file
import { Table, Button, Modal, Form, Container } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
const API_URL = "https://webapiproject-ffx8.onrender.com/api/Supplier";
 
const UpdateSupplierComponent = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [editFormData, setEditFormData] = useState({
        supplierId: "",
        supplierName: "",
        phone: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
 
    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                setSuppliers(response.data);
            } else {
                setError(`Failed to load suppliers. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            setError(`Failed to load suppliers: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);
 
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);
 
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
 
    const handleEditClick = (supplier) => {
        setSelectedSupplier(supplier);
        setEditFormData({ ...supplier });
        setShowEditModal(true);
    };
 
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedSupplier(null);
        setEditFormData({
            supplierId: "",
            supplierName: "",
            phone: "",
            email: "",
        });
    };
 
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };
 
    const validateSupplierName = (name) => {
        if (!/^[A-Z]/.test(name)) {
            return 'Name should start with a capital letter.';
        }
        if (/^[^A-Za-z]+/.test(name)) {
            return 'Name should not start with a special character or number.';
        }
        if (name.length < 6) {
            return 'Name should have a minimum of 6 letters.';
        }
        return '';
    };
 
    const validatePhoneNumber = (phone) => {
        if (!/^[0-9]{10}$/.test(phone)) {
            return 'Phone number must be exactly 10 digits.';
        }
        return '';
    };
 
    const validateEmail = (email) => {
        if (/^[0-9\W]+/.test(email)) {
            return 'Email should not start with a number or special character.';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Please enter a valid email address.';
        }
        return '';
    };
 
    const handleUpdateSupplier = async (e) => {
        e.preventDefault();
        setError('');
 
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
                toast.success("Supplier updated successfully.", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                handleCloseEditModal();
                setTimeout(() => {
                    fetchSuppliers();
                }, 300);
            } else {
                setError(`Failed to update supplier. Status: ${response.status}`);
                toast.error(`Failed to update supplier. Status: ${response.status}`);
            }
        } catch (error) {
            setError(`Failed to update supplier: ${error.message}`);
            toast.error(`Failed to update supplier: ${error.message}`);
        }
    };
 
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = suppliers.slice(indexOfFirstItem, indexOfLastItem);
 
    const pageCount = Math.ceil(suppliers.length / itemsPerPage);
 
    if (loading) {
        return <Container className="mt-4"><p>Loading suppliers...</p></Container>;
    }
 
    if (error) {
        return <Container className="mt-4"><p className="text-danger">{error}</p></Container>;
    }
 
    return (
        <Container className="mt-4">
            <ToastContainer />
            <h2>Update Supplier</h2>
            {error && <p className="text-danger">{error}</p>}
 
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((supplier) => (
                        <tr key={supplier.supplierId}>
                            <td>{supplier.supplierId}</td>
                            <td>{supplier.supplierName}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleEditClick(supplier)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
 
            {suppliers.length > itemsPerPage && (
                <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                />
            )}
 
            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleUpdateSupplier}>
                        <Form.Group className="mb-3">
                            <Form.Label>Supplier ID</Form.Label>
                            <Form.Control type="text" value={editFormData.supplierId || ""} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Supplier Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplierName"
                                value={editFormData.supplierName || ""}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={editFormData.phone || ""}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editFormData.email || ""}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Supplier
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
 
export default UpdateSupplierComponent;
 