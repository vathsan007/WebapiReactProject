import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link ,useNavigate} from 'react-router-dom';
 
 
function CommonNavbar() {
    const navigate = useNavigate();
 
    const handleLoginSuccess = (role) => {
      if (role === 'admin') {
        navigate('/adminnavbar');
      } else if (role === 'user') {
        navigate('/usernavbar');
      } else {
        navigate('/register');
      }
    };
 
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Inventory Management System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
 
export default CommonNavbar;