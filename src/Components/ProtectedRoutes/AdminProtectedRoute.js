
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
