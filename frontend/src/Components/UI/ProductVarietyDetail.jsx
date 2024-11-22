import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/VarietyDetail.css';
import { Button } from '@mui/material'; 
import NavBar from './NavBar'; 
import ProductModal from './ProductModal';  
import { useParams } from 'react-router-dom'; 
import Footer from '../Layout/Footer';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [varietyDetails, setVarietyDetails] = useState(null); 
  const { varietyId } = useParams(); 

  useEffect(() => {
    const fetchProductsByVariety = async () => {
      try {
        // Fetch products by varietyId
        const productResponse = await axios.get(`http://localhost:4000/api/products/variety/${varietyId}`);
        setProducts(productResponse.data.products); 

       
        const varietyResponse = await axios.get(`http://localhost:4000/api/variety/${varietyId}`);
        setVarietyDetails(varietyResponse.data.variety); 
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (varietyId) {
      fetchProductsByVariety();
    }
  }, [varietyId]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="menu-container">
      <NavBar />
   
      <div className="banner">
        <h1 className="banner-title">{varietyDetails?.name || 'MENU'}</h1> 
      </div>

      <section className="seasonal-section">
        <h2 className="section-title">{varietyDetails?.name || 'MENU'}</h2> 
        <p className="section-subtitle">{varietyDetails?.description || 'Seasonal'}</p> 
        <div className="seasonal-items">
          {products.length > 0 ? (
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
          ) : (
            <p>No products available for this variety.</p>
          )}
        </div>
      </section>

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
