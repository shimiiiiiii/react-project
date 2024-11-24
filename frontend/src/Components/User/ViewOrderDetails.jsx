import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Button } from '@mui/material';
import { getToken, errMsg } from '../../utils/helpers';

const ViewOrderDetails = () => {
  const { id } = useParams(); // Extract order ID from the URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(""); // State to manage main image

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          errMsg('You are not authorized. Please log in.');
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrderDetails(data.order);
        setLoading(false);
        // Set the main image initially
        if (data.order?.orderLine?.length > 0) {
          setMainImage(data.order.orderLine[0].product?.images[0]?.url || 'placeholder-image-url');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        errMsg('Failed to fetch order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!orderDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5">No order details found.</Typography>
      </Box>
    );
  }

  const handleImageClick = (url) => {
    setMainImage(url); // Update the main image when a thumbnail is clicked
  };

  return (
  
      <Box maxWidth="lg" width="100%">
        <Typography variant="h4" gutterBottom sx={{ color: '#333', textAlign: 'center' }}>
          Order Details
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {orderDetails.orderLine.map((item, index) => (
            <Grid item xs={12} md={8} key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexDirection="row"
                sx={{
                  backgroundColor: 'white',
                  padding: 4,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box
                  flex="1"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ paddingRight: 4 }}
                >
                  <CardMedia
                    component="img"
                    image={mainImage}
                    alt={item.productName || 'Product image'}
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </Box>

                <Box flex="2">
                  <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>
                    {item.productName}
                  </Typography>

                  {/* <Typography variant="body1" sx={{ color: '#555', marginBottom: 1 }}>
                    Description: {item.product.description || 'No description available'}
                  </Typography> */}

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: 1 }}>
                    Price: ${item.price.toFixed(2)}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: 1 }}>
                    Quantity: {item.quantity}
                  </Typography>

                  <Typography variant="body1" sx={{ color: '#555', marginBottom: 1 }}>
                    Shipping Fee: ${orderDetails.shippingFee.toFixed(2)}
                  </Typography>

                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                    Subtotal: ${((item.price * item.quantity) + orderDetails.shippingFee).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="flex-start" mt={2}>
                {item.product?.images?.map((img, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleImageClick(img.url)}
                    sx={{
                      width: 50,
                      height: 50,
                      padding: 0,
                      marginRight: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={img.url}
                      alt={`Image preview ${idx}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: mainImage === img.url ? '2px solid blue' : 'none',
                      }}
                    />
                  </Button>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default ViewOrderDetails;
