import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Modal, Box } from '@mui/material'; // Ensure you've installed @mui/material
import '../CSS/Navbar.css';
import itachiLogo from '../images/itachi.jpg';
import Login from '../User/Login'; 
import AddToCartModal from '../UI/AddtoCartModal'; // Ensure AddToCartModal is imported correctly
import { FaUser } from 'react-icons/fa';
import EditProfile from '../User/EditProfile'; // Ensure EditProfile is imported correctly

const CustomNavbar = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // State for cart modal
  const [profileOpen, setProfileOpen] = useState(false); // State for profile modal

  // Open/Close logic for Login Modal
  const handleOpenLogin = () => setOpen(true);
  const handleCloseLogin = () => setOpen(false);

  // Open/Close logic for AddToCart Modal
  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);

  // Open/Close logic for EditProfile Modal
  const handleOpenUser = () => setProfileOpen(true);
  const handleCloseUser = () => setProfileOpen(false);

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here, such as clearing session or tokens
    console.log('Logging out...');
    // Optionally, clear tokens or redirect to login page
  };

  return (
    <>
      <Navbar className="custom-navbar" expand="lg">
        <Navbar.Brand href="#home" className="logo">
          <img src={itachiLogo} alt="Logo" className="logo-img" />
          DUCK DONUTS
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto menu-links">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="#reviews">Reviews</Nav.Link>
            <Nav.Link href="/my-orders">My Orders</Nav.Link>

            {/* Order Online Button */}
            <Button className="order-button" onClick={handleOpenLogin}>
              Order Online!
            </Button>

            {/* Add to Cart Button (Icon) */}
            <Button className="addtocart-button" onClick={handleOpenCart}>
              🛒
            </Button>

            {/* User Icon Button */}
            <Button className="user-icon-button" onClick={handleOpenUser}> {/* Open Edit Profile Modal */}
              <FaUser />
            </Button>

            {/* Logout Button */}
            {/* <Button className="logout-button" onClick={handleLogout}>Logout</Button> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      Login Modal
      <Modal open={open} onClose={handleCloseLogin}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Login handleClose={handleCloseLogin} />
        </Box>
      </Modal>

      {/* <Modal open={profileOpen} onClose={handleCloseLogin}>
      <EditProfile handleClose={handleCloseLogin} /> */}

      {/* Add to Cart Modal */}
      <AddToCartModal open={cartOpen} handleClose={handleCloseCart} />

      {/* Edit Profile Modal */}
      <Modal open={profileOpen} onClose={handleCloseUser}>
          <EditProfile handleClose={handleCloseUser} />
          
      </Modal>
    </>
  );
};

export default CustomNavbar;
