import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Modal, Box } from '@mui/material';
import '../CSS/Navbar.css';
import itachiLogo from '../images/itachi.jpg';
import Login from '../User/Login'; // Import the Login component

const CustomNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Navbar className="custom-navbar" expand="lg">
        <Navbar.Brand href="#home" className="logo">
          <img src={itachiLogo} alt="Logo" className="logo-img" />
          DUCK DONUTS
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto menu-links">
            <Nav.Link href="#home">home</Nav.Link>
            <Nav.Link href="#menu">menu</Nav.Link>
            <Nav.Link href="#catering">catering</Nav.Link>
            <Nav.Link href="#locations">locations</Nav.Link>
            <Nav.Link href="#about">about us</Nav.Link>
            <Nav.Link href="#jobs">jobs</Nav.Link>
            <Nav.Link href="#newsroom">newsroom</Nav.Link>
            <Nav.Link href="#giftcards">gift cards</Nav.Link>
            <Nav.Link href="#chat">quack chat</Nav.Link>
            <Nav.Link href="#franchise" className="franchise-opportunities">
              Franchising Opportunities
            </Nav.Link>
            <Button className="order-button" onClick={handleOpen}>
              Order Online!
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Login Modal */}
      <Modal open={open} onClose={handleClose}>
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
          <Login handleClose={handleClose} /> {/* Pass handleClose to Login */}
        </Box>
      </Modal>
    </>
  );
};

export default CustomNavbar;
