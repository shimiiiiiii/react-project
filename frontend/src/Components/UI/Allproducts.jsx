import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/AllProduct.css';
import { Button, Slider, Checkbox, FormControlLabel } from '@mui/material';
import NavBar from './NavBar';
import ProductModal from './ProductModal';

const AllProducts = () => {
  const [products, setProducts] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [loading, setLoading] = useState(false); // Track loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product

  // Filter state
  const [selectedVariety, setSelectedVariety] = useState(''); // Variety filter
  const [priceRange, setPriceRange] = useState([0, 1000]); // Price filter range (min, max)
  const [varieties, setVarieties] = useState([]); // Store varieties

  // Fetch all products and varieties
  const fetchAllData = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const productResponse = await axios.get('http://localhost:4000/api/products/all');
      setProducts(productResponse.data.products); // Set all products
      setFilteredProducts(productResponse.data.products); // Set filtered products initially to all products

      const varietyResponse = await axios.get('http://localhost:4000/api/varieties'); // Fetch varieties
      setVarieties(varietyResponse.data.varieties); // Set varieties
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Apply filters to the products
  const applyFilters = () => {
    let filtered = products;

    // Filter by selected variety
    if (selectedVariety) {
      filtered = filtered.filter((product) => product.variety.name === selectedVariety);
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });

    setFilteredProducts(filtered); // Set the filtered products
  };

  // Load products and varieties on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Reapply filters when variety or price range changes
  useEffect(() => {
    applyFilters();
  }, [selectedVariety, priceRange]);

  // Open the modal to show product details
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
  <div className="menu-container" style={{ display: 'flex', gap: '20px' }}>
  {/* Filter Container */}
  <div className="filter-container">
    <h3 className="filter-header">Filters</h3>

    <Button
      variant="outlined"
      size="small"
      className="reset-button"
      onClick={() => {
        setSelectedVariety('');
        setPriceRange([0, 1000]);
      }}
    >
      Reset All
    </Button>

    {/* Variety Filter */}
    <div className="filter-section">
      <h4 className="filter-title">Varieties</h4>
      <div className="filter-options">
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedVariety === ''}
              onChange={() => setSelectedVariety('')}
            />
          }
          label="All"
        />
        {varieties.map((variety) => (
          <FormControlLabel
            key={variety._id}
            control={
              <Checkbox
                checked={selectedVariety === variety.name}
                onChange={() => setSelectedVariety(variety.name)}
              />
            }
            label={variety.name}
          />
        ))}
      </div>
    </div>

    {/* Price Filter */}
    <div className="filter-section">
      <h4 className="filter-title">Price</h4>
      <div className="price-range">
        <input
          type="text"
          value={`$${priceRange[0]}`}
          readOnly
          className="price-input"
        />
        <input
          type="text"
          value={`$${priceRange[1]}`}
          readOnly
          className="price-input"
        />
      </div>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="off"
        min={0}
        max={2400}
        step={10}
      />
    </div>
  </div>

  {/* Product Display Section */}
  <section className="seasonal-section" style={{ marginLeft: '0px', flexGrow: 1 }}>
    <h2 className="section-title">Our Products</h2>
    <p className="section-subtitle">Explore our full range of products</p>
    <div className="seasonal-items">
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
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
        <p>No products available.</p>
      )}
    </div>
  </section>
  <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={closeModal}
      />
</div>

  );
};

export default AllProducts;
