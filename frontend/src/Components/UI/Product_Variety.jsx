import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Product_Variety.css';

const ProductVariety = () => {
  const [productsByVariety, setProductsByVariety] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products-by-variety'); 
        setProductsByVariety(response.data.groupedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-variety-container">
      {Object.entries(productsByVariety).map(([variety, products]) => (
        <div key={variety} className="variety-group">
          <h2 className="variety-title">{variety}</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img src={product.images[0]?.url} alt={product.name} className="product-image" />
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <a href={product.link} className="view-menu-link">
            View Menu <span className="arrow">→</span>
        </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariety;
