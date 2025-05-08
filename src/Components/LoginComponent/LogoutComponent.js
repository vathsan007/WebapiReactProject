import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
const LogoutComponent = () => {
  const navigate = useNavigate();
 
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to the common navbar
  }, [navigate]);
 
  return <div>Logging out...</div>;
};
 
export default LogoutComponent