import React from 'react'; 
import '../CSS/Home.css';
import ProductVariety from './Product_Variety'; 
import { Button } from '@mui/material'; 
import Navbar from './NavBar';
import Footer from '../Layout/Footer';
import ProductAll from './Allproducts';

const HomeWithProducts = () => {
  return (
    <div>
      <Navbar /> 
      <div className="home-container">
        <div className="text-overlay">
          <h1 style={{ color: 'white', fontSize: '6rem' }}>Warm, Delicious,<br />MADE TO ORDER</h1>
          <p style={{ fontSize: '1.5rem' }}>Customized Before Your Eyes!</p>
          <div className="button-group">
            <Button 
              className="order-online-btn" 
              variant="contained" 
              sx={{ 
                backgroundColor: '#009fe3', 
                '&:hover': { backgroundColor: '#0088c1' },
                padding: '16px 32px',
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontFamily: "'Sour Gummy', sans-serif" /* Apply Sour Gummy font here */
              }}
            >
              Order Online
            </Button>
            <Button 
              className="seasonal-flavors-btn" 
              variant="contained" 
              sx={{ 
                backgroundColor: '#ff4b8b', 
                '&:hover': { backgroundColor: '#e13b73' },
                padding: '16px 32px',
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontFamily: "'Sour Gummy', sans-serif" /* Apply Sour Gummy font here */
              }}
            >
              Seasonal Flavors
            </Button>
          </div>
        </div>
      </div>
      <ProductVariety />
      <ProductAll />
      <Footer /> 
    </div>
  );
};

export default HomeWithProducts;
