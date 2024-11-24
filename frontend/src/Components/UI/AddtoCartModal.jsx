import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/AddToCartModal.css';

const AddToCartModal = ({ open, handleClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    street: '',
    country: '',
  });
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(50); // Example default fee
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      let token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your cart.');
        setMessage('No token found. Please log in.');
        return;
      }

      token = token.replace(/^"|"$/g, '');

      try {
        const response = await axios.get('http://localhost:4000/api/cart/display', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedCartItems = response.data.cart;

        setCartItems(fetchedCartItems);
        setSelectedItems(fetchedCartItems); // Default: all items are selected
        calculateTotal(fetchedCartItems, shippingFee);
      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
        const errorMessage =
          error.response?.data?.message || 'Failed to fetch cart items.';
        alert(`Error: ${errorMessage}`);
        setMessage(errorMessage);
      }
    };

    if (open) {
      fetchCartItems();
    }
  }, [open, shippingFee]);

  const calculateTotal = (items, shippingFee) => {
    const calculatedSubtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);
    setTotalPrice(calculatedSubtotal + shippingFee);
  };

  const handleCheckboxChange = (item) => {
    const isSelected = selectedItems.find((i) => i._id === item._id);
    let updatedSelection;

    if (isSelected) {
      // Remove item from selection
      updatedSelection = selectedItems.filter((i) => i._id !== item._id);
    } else {
      // Add item to selection
      updatedSelection = [...selectedItems, item];
    }

    setSelectedItems(updatedSelection);
    calculateTotal(updatedSelection, shippingFee);
  };

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.street || !shippingInfo.country) {
      alert('Please fill out all shipping information.');
      return;
    }
  
    // Prepare the data for the checkout
    const orderData = {
      orderLine: selectedItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })), // Map to include only product ID and quantity
      shippingInfo,
      subtotal,
      shippingFee,
      totalPrice,
    };
  
    try {
      let token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please log in to proceed with the checkout.');
        return;
      }
  
      token = token.replace(/^"|"$/g, '');
  
      // Make the POST request to your checkout API route
      const response = await axios.post(
        'http://localhost:4000/api/cart/checkout',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Handle success
      console.log('Checkout successful:', response.data);
      alert('Your order has been placed successfully!');
      handleClose(); // Close the modal
    } catch (error) {
      // Handle error
      console.error('Error during checkout:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || 'Failed to complete the checkout process.';
      alert(`Error: ${errorMessage}`);
    }
  };
  

  return (
    open && (
      <div className="add-to-cart-overlay">
        <div className="add-to-cart-container">
          <div className="cart-modal-header">
            <h3>Your Cart</h3>
          </div>

          <div className="cart-items-list">
  {cartItems.length === 0 ? (
    <p>Your cart is empty!</p>
  ) : (
    cartItems.map((item, index) => (
      <div key={index} className="cart-item">
        <input
          type="checkbox"
          checked={!!selectedItems.find((i) => i._id === item._id)}
          onChange={() => handleCheckboxChange(item)}
        />
        <img
          src={(item.images && item.images[0]?.url) || 'default-image.jpg'}
          alt={item.name || 'Product Image'}
          className="cart-item-image"
        />
        <div className="cart-item-details">
          <p className="cart-item-name">Product Name: {item.name}</p>
          <p className="cart-item-price">Price: P{item.price}</p>
          <p className="cart-item-quantity">Quantity: {item.quantity}</p>
          <div className="cart-item-actions">
            <button onClick={() => handleDecrement(item)}>-</button>
            <button onClick={() => handleIncrement(item)}>+</button>
            <button onClick={() => handleRemove(item)}>Remove</button>
          </div>
        </div>
      </div>
    ))
  )}
</div>


          {selectedItems.length > 0 && (
            <div className="cart-summary">
              <h4>Summary</h4>
              <p>Subtotal: P{subtotal.toFixed(2)}</p>
              <p>Shipping Fee: P{shippingFee.toFixed(2)}</p>
              <p>Total: P{totalPrice.toFixed(2)}</p>
            </div>
          )}

          <div className="shipping-info">
            <h4>Shipping Information</h4>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleShippingChange}
            />
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={shippingInfo.street}
              onChange={handleShippingChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
            />
          </div>

          {message && <p className="cart-message">{message}</p>}

          {selectedItems.length > 0 && (
            <div className="cart-modal-footer">
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <button onClick={handleClose} className="close-modal-btn">
              Close
            </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default AddToCartModal;
