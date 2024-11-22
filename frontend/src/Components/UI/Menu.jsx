import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Menu.css';
import { Button } from '@mui/material'; 
import NavBar from './NavBar'; 
import ProductModal from './ProductModal'; 
import { Link } from 'react-router-dom'; 
import Footer from '../Layout/Footer';

const Menu = () => {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchVarietiesAndProducts = async () => {
      try {
        const { data: varietyData } = await axios.get('http://localhost:4000/api/varieties');
        const updatedVarieties = await Promise.all(
          varietyData.varieties.map(async (variety) => {
            try {
              const { data: productData } = await axios.get(`http://localhost:4000/api/products/variety/${variety._id}`);
              return {
                ...variety,
                products: productData.products.slice(0, 4), 
              };
            } catch {
              return {
                ...variety,
                products: [], 
              };
            }
          })
        );
        setVarieties(updatedVarieties);
      } catch (error) {
        console.error('Error fetching varieties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVarietiesAndProducts();
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
      {loading ? (
        <p>Loading varieties...</p>
      ) : (
        varieties.map((variety) => (
          <section className="seasonal-section" key={variety._id}>
            <h2 className="section-title">{variety.name}</h2>
            <p className="section-subtitle">{variety.description}</p>
            <div className="seasonal-items">
              {variety.products && variety.products.length > 0 ? (
                variety.products.map((product) => (
                  <div
                    className="item"
                    key={product._id}
                    onClick={() => openModal(product)}
                  >
                    <img
                      src={product.images[0]?.url || '/images/placeholder.png'} 
                      alt={product.name}
                      className="product-image"
                    />
                    <p className="item-title">{product.name}</p>
                  </div>
                ))
              ) : (
                <p className="no-products-message">No products available for this variety.</p>
              )}
            </div>
            <Button
              className="view-all-btn"
              variant="contained"
              color="primary"
              component={Link}
              to={`/products/variety/${variety._id}`}
            >
             View All
            </Button>
          </section>
        ))
      )}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={closeModal}
      />
         <Footer /> 
    </div>
  );
};

export default Menu;
