import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Select, Spin } from "antd";
import { notification } from 'antd';
import Dashboard from "./Dashboard";
const { Option } = Select;

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const response = await axios.get("http://localhost:4000/api/orders");
    setOrders(response.data.data);
  } catch (error) {
    notification.error({
      message: 'Error',
      description: 'There was an issue fetching orders. Please try again later.',
    });
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};


const updateOrderStatus = async (orderId, newStatus) => {
    try {
      let token = sessionStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update order status.");
        return;
      }
      token = token.replace(/^"|"$/g, ""); // Clean token
  
      // API call
      const response = await axios.put(
        `http://localhost:4000/api/order/${orderId}`,
        { newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Update the status in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
  
      // Notify success
      notification.success({
        message: "Success",
        description: "Order status updated successfully!",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update order status.";
      console.error("Error updating order status:", error);
      alert(`Error: ${errorMessage}`);
    }
  };
  

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setDetailsVisible(false);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "orderLine",
      key: "name",
      render: (orderLine) => (
        <span>{orderLine.map((item) => item.name).join(", ")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => updateOrderStatus(record._id, value)}
          disabled={updatingStatus}
        >
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetails(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Dashboard>
      <div>
      <h2>Orders</h2>
      {loading ? (
        <Spin tip="Loading orders..." />
      ) : (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        title={`Order Details - ${selectedOrder?._id}`}
        open={detailsVisible}
        onCancel={closeOrderDetails}
        footer={<Button onClick={closeOrderDetails}>Close</Button>}
      >
        {selectedOrder && (
          <div>
            <h3>Order Items</h3>
            <Table
              dataSource={selectedOrder.orderLine}
              columns={[
                { title: "Product Name", dataIndex: "name", key: "name" },
                { title: "Price", dataIndex: "price", key: "price" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                { title: "Image", dataIndex: "image", key: "image", render: (image) => (
                    <img src={image} alt="product" style={{ width: "50px" }} />
                  )
                },
              ]}
              rowKey={(item) => item.product}
              pagination={false}
            />
          </div>
        )}
      </Modal>
      </div>
    </Dashboard>
  );
};

export default OrdersTable;
