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
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [varietyDetails, setVarietyDetails] = useState(null);
  const [page, setPage] = useState(1); // Tracks the current page for pagination
  const [hasMore, setHasMore] = useState(true); // Tracks if more products are available
  const { varietyId } = useParams();

  useEffect(() => {
    const fetchProductsByVariety = async () => {
      if (!hasMore) return; // Stop fetching if there are no more products
      setLoading(true);
      try {
        // Fetch products by varietyId with pagination
        const productResponse = await axios.get(
          `http://localhost:4000/api/products/variety/${varietyId}?page=${page}`
        );
        setProducts((prevProducts) => [
          ...prevProducts,
          ...productResponse.data.products,
        ]);
        setHasMore(productResponse.data.products.length > 0);

        if (page === 1) {
          const varietyResponse = await axios.get(
            `http://localhost:4000/api/variety/${varietyId}`
          );
          setVarietyDetails(varietyResponse.data.variety);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByVariety();
  }, [page, varietyId, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <h1 className="banner-title">{varietyDetails?.name || 'MENU'}</h1>
      </div>

      <section className="seasonal-section">
        <h2 className="section-title">{varietyDetails?.name || 'MENU'}</h2>
        <p className="section-subtitle">
          {varietyDetails?.description || 'Seasonal'}
        </p>
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
        {loading && <p>Loading...</p>}
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
