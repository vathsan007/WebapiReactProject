import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom

import 'bootstrap/dist/css/bootstrap.min.css';

function AdminNavbar({onLogout}) {

const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" bg="dark" variant='dark'>
      <Container>
        <Navbar.Brand as={Link} to="/homeadmin">Inventory Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/homeadmin">Home</Nav.Link>

            <NavDropdown title="Orders" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/orders/update">Manage Orders</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Products" id="basic-nav-dropdown">
              {/* <NavDropdown.Item as={Link} to="/products/list">Product Lists</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/products/add">Product Info</NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/products/update">Update Product</NavDropdown.Item> */}
              {/* <NavDropdown.Item as={Link} to="/products/delete">Delete Product</NavDropdown.Item> */}
              {/* <NavDropdown.Item as={Link} to="/products/filter">Filter Product</NavDropdown.Item> */}
            </NavDropdown>

            <NavDropdown title="Stocks" id="basic-nav-dropdown">
              {/* <NavDropdown.Item as={Link} to="/stocks/all">All Stocks</NavDropdown.Item> */}
              <NavDropdown.Item href="/stocks/manage">Manage Stock</NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/stocks/reduce">Reduce Stock</NavDropdown.Item> */}
              {/* <NavDropdown.Item as={Link} to="/stocks/discard">Discard Stock</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/stocks/out-of-stock">Out Of Stock</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Supplier" id="basic-nav-dropdown">
              {/* Use Link for SPA navigation */}
              {/* <NavDropdown.Item as={Link} to="/supplier/details">Supplier Details</NavDropdown.Item> */}
              <NavDropdown.Item as={Link} to="/supplier/add">Manage Supplier</NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/supplier/update">Update Supplier</NavDropdown.Item> */}
              {/* <NavDropdown.Item as={Link} to="/supplier/delete">Delete Supplier</NavDropdown.Item> */}
            </NavDropdown>

            <NavDropdown title="Reports" id="basic-nav-dropdown">
              <NavDropdown.Item href="/report/user-order">User Order Report</NavDropdown.Item>          
              <NavDropdown.Item href="/report/stock-level">Stock Level Report</NavDropdown.Item>
              <NavDropdown.Item href="/report/sales-report">Sales Report</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Profile" id="basic-nav-dropdown">
              {/* Use Link for SPA navigation */}
              <NavDropdown.Item as={Link} to="/profile/account">Account</NavDropdown.Item>
              {/* Keep onClick for logout as it performs an action and navigates away */}
              <NavDropdown.Item onClick={handleLogoutClick}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;