  import React, { useState, useEffect } from 'react';
  import Modal from 'react-modal';
  import axios from 'axios';
  import '../CSS/ProductModal.css';

  Modal.setAppElement('#root');

  const ProductModal = ({ isOpen, product, closeModal }) => {
    const [selectedImage, setSelectedImage] = useState(product?.images[0]?.url || '');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null); // State to hold user info

    useEffect(() => {
      if (product?.images?.length > 0) {
        setSelectedImage(product.images[0].url);
      }
      // Fetch user details from sessionStorage or backend
      const token = sessionStorage.getItem('token');
      if (token) {
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get('http://localhost:4000/api/user/me', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
          } catch (error) {
            console.error('Failed to fetch user details:', error);
          }
        };
        fetchUserDetails();
      }
    }, [product]);

    // Function to add product to cart
    const handleAddToCart = async () => {
      try {
        let token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
        if (token) {
          // Remove surrounding quotes if they exist
          token = token.replace(/^"|"$/g, '');
          console.log('Sending token:', token); // Ensure token is correct
          
    
          if (!token) {
            setMessage('Please log in to add items to your cart.');
            return;
          }
    
          // Log user token, product details, and user name
          // alert(
          //   `User Token: ${token}\n` +
          //   `User Name: ${user?.name || 'Unknown'}\n` +
          //   `Product ID: ${product._id}\n` +
          //   `Product Name: ${product.name}\n` +
          //   `Product Price: P${product.price}\n` +
          //   `Product Quantity: 1`
          // );
    
          const response = await axios.post(
            'http://localhost:4000/api/cart',
            { productId: product._id, quantity: 1 }, // Replace with desired quantity
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          // Alert success message after insertion
          alert('Product added to cart successfully!');
          setMessage('Product added to cart successfully!');
        }
      } catch (error) {
        // Alert error message
        const errorMessage =
          error.response?.data?.message || 'Failed to add product to cart.';
        alert(`Error: ${errorMessage}`);
        setMessage(errorMessage);
      }
    };
    

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
              <img
                src={selectedImage}
                alt={product.name}
                className="main-product-image"
              />

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
                <p className="product-reviews">
                  Product Reviews: {product.numOfReviews} Reviews
                </p>
              </div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <span className="cart-icon">🛒</span> Add to Cart
              </button>
              {message && <p className="cart-message">{message}</p>}
            </div>
          </div>
        )}
      </Modal>
    );
  };

  export default ProductModal;