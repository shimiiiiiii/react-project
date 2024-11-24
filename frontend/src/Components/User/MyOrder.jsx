import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/v1/orders/my-orders");
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    setSelectedOrder(order);
  };

  const handleSubmitReview = async (productId) => {
    try {
      const response = await axios.post(`/api/reviews`, {
        productId,
        review,
        rating,
      });
      alert("Review submitted successfully!");
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  return (
    <div>
      <h2>My Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.orderName}</td>
              <td>{order.orderStatus}</td>
              <td>
                <button onClick={() => handleViewOrder(order._id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div>
          <h3>Order Details</h3>
          <p>Order ID: {selectedOrder._id}</p>
          <p>Status: {selectedOrder.orderStatus}</p>
          <ul>
            {selectedOrder.orderLine.map((item) => (
              <li key={item.product._id}>
                <p>{item.product.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
                {selectedOrder.orderStatus === "Delivered" && (
                  <div>
                    <textarea
                      placeholder="Write a review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Rating (1-5)"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    />
                    <button onClick={() => handleSubmitReview(item.product._id)}>
                      Submit Review
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
