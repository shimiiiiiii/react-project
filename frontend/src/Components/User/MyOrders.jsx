import React, { useState, useEffect } from 'react';
import { getToken, errMsg } from '../../utils/helpers.js';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = getToken(); // Retrieve token from sessionStorage
      if (!token) {
        errMsg('You are not authorized. Please log in.');
        setLoading(false);
        return;
      }
  
      const { data } = await axios.get(`${import.meta.env.VITE_API}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      errMsg('Failed to fetch orders. Please try again later.');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Date Placed</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>₱ {order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      component={Link}
                      to={`/order/${order._id}`}
                      sx={{ marginRight: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/order/${order._id}/review`}
                    >
                      Write a Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No orders found.</Typography>
      )}
    </Box>
  );
};

export default MyOrders;
