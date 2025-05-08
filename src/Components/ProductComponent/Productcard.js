

import React from 'react';
import { Link } from 'react-router-dom';
 
const Productcard = ({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.productName}</h3>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Available Quantity: {product.availableQuantity}</p>
      <p>Unit Price: {product.unitPrice}</p>
      <Link to={`/order/place/${product.productId}`}>
        <button>Place Order</button>
      </Link>
    </div>
  );
};
 
export default Productcard;