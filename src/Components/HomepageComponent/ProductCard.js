import React, { useState } from 'react';
import './ProductCard.css';
 
const ProductCard = ({
  product,
  orderProductId,
  orderedQuantity,
  onQuantityChange,
  onPlaceOrder,
  onInitiateOrder
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
 
  const handlePlaceOrderClick = () => {
    if (isOrdering) {
      onPlaceOrder();
    } else {
      setIsOrdering(true);
      onInitiateOrder(product.productId);
    }
  };
 
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.productName}
          className="product-image"
        />
      </div>
 
      <div className="product-info">
        <h2 className="product-title">{product.productName}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₹{product.unitPrice}</p>
 
        <div className="quantity-order">
          {isOrdering && (
            <input
              type="number"
              value={orderProductId === product.productId ? orderedQuantity : ''}
              onChange={onQuantityChange}
              min="1"
              placeholder="Qty"
              className="quantity-input"
            />
          )}
          <button
            className="order-button"
            onClick={handlePlaceOrderClick}
          >
            {isOrdering ? 'Confirm Order' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default ProductCard;
 
 