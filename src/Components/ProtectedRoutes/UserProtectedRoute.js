
import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');

  if (role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
