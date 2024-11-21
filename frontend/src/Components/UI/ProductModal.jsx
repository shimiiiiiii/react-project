import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/ProductModal.css'; 

Modal.setAppElement('#root');

const ProductModal = ({ isOpen, product, closeModal }) => {

  const [selectedImage, setSelectedImage] = useState(product?.images[0]?.url || '');

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {product && (
        <div className="product-detail-container">
          <div className="product-images">

            <img src={selectedImage} alt={product.name} className="main-product-image" />
            
            {product.images.length > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`thumbnail-${index}`}
                    className="thumbnail-image"
                    onClick={() => setSelectedImage(image.url)}  
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>PRODUCT DETAILS</h1>
            <h2 className="product-name">Product Name: {product.name}</h2>
            <p className="product-price">Price: P{product.price}</p>
            <p className="product-description">Description: {product.description}</p>
            <div className="ratings">
              <p className="product-ratings">Ratings: {product.ratings} / 5</p>
              <p className="product-reviews">Product Reviews: {product.numOfReviews} Reviews</p>
            </div>
            <button className="add-to-cart-btn">
              <span className="cart-icon">🛒</span> Add to Cart
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductModal;
