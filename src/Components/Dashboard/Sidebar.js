import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
 
function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/products/add">Add Product</Link></li>
        <li><Link to="/stock/add">Add Stock</Link></li>
        <li><Link to="/place-order">Place Order</Link></li>
      </ul>
    </div>
  );
}
 
export default Sidebar;
 