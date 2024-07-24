import React from "react";
import "./ProductItem.css";

function ProductItem({ product }) {
  return (
    <div className="product-item">
      <img
        src={product.productImage}
        alt={product.productTitle}
        className="product-image"
      />
      <h3 className="product-title">{product.productTitle}</h3>
      <span className="product-price">{product.productPrice} TL</span>
    </div>
  );
}

export default ProductItem;
