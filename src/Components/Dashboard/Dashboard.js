import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import axios from 'axios';
import Layout from './Layout'

 
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5203/api/orders/details');
                setUser(response.data);
            } catch (error) {
                console.error('Authentication failed:', error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };
 
        fetchUserData();
    }, [navigate]);
 
    return (
        <div>
            <h2>Dashboard</h2>
            {user ? <Layout/> : <p>Loading...</p>}
        </div>
    );
};
 
export default Dashboard;
 
 