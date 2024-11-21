import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Menu.css';
import { Button } from '@mui/material'; 
import NavBar from './NavBar'; 

import ProductModal from './ProductModal';  

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/products'); 
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="menu-container">
      <NavBar />
   
      <div className="banner">
        <h1 className="banner-title">MENU</h1>
      </div>

      <section className="seasonal-section">
        <h2 className="section-title">MENU</h2>
        <p className="section-subtitle">Seasonal</p>
        <div className="seasonal-items">
          {loading ? (
            <p>Loading seasonal items...</p>
          ) : (
            products.map((product) => (
              <div
                className="item"
                key={product._id}
                onClick={() => openModal(product)} 
              >
                <img
                  src={product.images[0]?.url || 'default-image.png'}
                  alt={product.name}
                  className="item-image"
                />
                <p className="item-title">{product.name}</p>
              </div>
            ))
          )}
        </div>
        {!loading && (
          <Button className="view-all-btn" variant="contained" color="primary">
            View All
          </Button>
        )}
      </section>

      <section className="fan-favorites-section">
        <h2 className="section-title">Fan Favorites</h2>
      </section>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default Menu;
