import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterProductsComponent from '../ProductComponent/FilterProductsComponent'; // Import the FilterProducts component
 
const HomepageAdmin = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]); 
  const navigate = useNavigate();
 
 
  const handleReorderClick = (productId) => {
    navigate(`/stocks/manage`, { state: { productId } });
  };
 
  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <FilterProductsComponent /> {/* Include the FilterProducts component */}
        </div>
      </div>
     </div>
  );
};
 
export default HomepageAdmin;
 
 