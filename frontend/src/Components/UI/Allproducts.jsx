import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/AllProduct.css";
import { Button, Slider, Checkbox, FormControlLabel } from "@mui/material";
import ProductModal from "./ProductModal";

const AllProducts = () => {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product
  
  // Filter states
  const [selectedVarieties, setSelectedVarieties] = useState([]); // Array of selected varieties
  const [priceRange, setPriceRange] = useState([0, 1000]); // Price range (min, max)
  const [varieties, setVarieties] = useState([]); // All varieties

  // Fetch all products and varieties
  const fetchAllData = async () => {
    setLoading(true); // Set loading to true while fetching
    try {
      const productResponse = await axios.get(
        "http://localhost:4000/api/products/all"
      );
      setProducts(productResponse.data.products); // All products
      setFilteredProducts(productResponse.data.products); // Initially all products

      const varietyResponse = await axios.get(
        "http://localhost:4000/api/varieties"
      );
      setVarieties(varietyResponse.data.varieties); // Set varieties
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Apply filters to products
  const applyFilters = () => {
    let filtered = [...products]; // Use the full product list

    // Filter by selected varieties
    if (selectedVarieties.length > 0) {
      filtered = filtered.filter((product) =>
        selectedVarieties.includes(product.variety.name)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered); // Update filtered products
  };

  // Handle variety selection (checkbox)
  const handleVarietyChange = (varietyName) => {
    setSelectedVarieties((prevSelected) =>
      prevSelected.includes(varietyName)
        ? prevSelected.filter((name) => name !== varietyName) // Remove if already selected
        : [...prevSelected, varietyName] // Add if not already selected
    );
  };

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

  // Handle reset button click
  const handleReset = () => {
    setSelectedVarieties([]); // Reset selected varieties
    setPriceRange([0, 1000]); // Reset price range
    setFilteredProducts(products); // Reset filtered products to the full list of products
  };

  // Load products and varieties on component mount
  useEffect(() => {
    fetchAllData(); // Fetch all data on component mount
  }, []);

  // Reapply filters when varieties or price range changes
  useEffect(() => {
    applyFilters(); // Apply filters if varieties or price range change
  }, [selectedVarieties, priceRange]);

  // Update filteredProducts when products change (even when no filter is applied)
  useEffect(() => {
    // Reset filtered products to full list of products whenever products are updated
    setFilteredProducts(products); 
  }, [products]); // This ensures that filtered products always reflect the latest products data

  return (
    <div className="menu-container" style={{ display: "flex", gap: "20px" }}>
      {/* Filter Container */}
      <div className="filter-container">
        <h3 className="filter-header">Filters</h3>

        <Button
          variant="outlined"
          size="small"
          className="reset-button"
          onClick={handleReset}
        >
          Reset All
        </Button>

        {/* Variety Filter */}
        <div className="filter-section">
          <h4 className="filter-title">Varieties</h4>
          <div className="filter-options">
            {varieties.map((variety) => (
              <FormControlLabel
                key={variety._id}
                control={
                  <Checkbox
                    checked={selectedVarieties.includes(variety.name)}
                    onChange={() => handleVarietyChange(variety.name)}
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
      <section
        className="seasonal-section"
        style={{ marginLeft: "0px", flexGrow: 1 }}
      >
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
                  src={product.images[0]?.url || "default-image.png"}
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

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={closeModal}
      />
    </div>
  );
};

export default AllProducts;
