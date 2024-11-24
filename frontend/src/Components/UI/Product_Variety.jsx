import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import '../CSS/Product_Variety.css';
import Footer from '../Layout/Footer';
const ProductVariety = () => {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/varieties'); 
        setVarieties(response.data.varieties); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching varieties:', error);
        setLoading(false);
      }
    };

    fetchVarieties();
  }, []);

  if (loading) return <p>Loading varieties...</p>;

  return (
    <>
      <h1 className="product-variety-title">Product Variety</h1>
      <h3 className="product-variety-subtitle">Choose from our wide selection of products</h3>
      <div className="product-variety-container">
        {varieties.map((variety) => (
          <div className="product-card" key={variety._id}>
            <img src={variety.images?.[0]?.url} alt={variety.name} className="product-image" />
            <h3 className="product-title">{variety.name}</h3>
            <p className="product-description">{variety.description}</p>
            <Link to={`/products/variety/${variety._id}`} className="view-menu-link">
              View Menu <span className="arrow">→</span>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductVariety;
