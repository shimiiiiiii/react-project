    const Cart = require('../models/cart.js');
    const Product = require('../models/product.js');
    const User = require('../models/user.js');
    const Order = require('../models/order.js');
    const mongoose = require('mongoose');
    const nodemailer = require('nodemailer');

    exports.addToCart = async (req, res) => {
        try {
        const { productId, quantity } = req.body;
    
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required." });
        }
    
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
    
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, cartItems: [] });
        }
    
        const cartItemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex > -1) {
            cart.cartItems[cartItemIndex].quantity += quantity;
        } else {
            cart.cartItems.push({
            product: productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity,
            });
        }
    
        await cart.save();
    
        return res.status(200).json({ message: "Product added to cart successfully.", cart });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };
    

    exports.getCartItems = async (req, res) => {
        try {
            const userId = req.user.id; // Get the user ID from the authenticated request
    
            // Find the cart for the user and populate the product details
            const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
    
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }
    
            res.status(200).json({
                success: true,
                cart: cart.cartItems, // Send populated cart items
            });
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    };

    exports.deleteCartItem = async (req, res) => {
        try {
          const userId = req.user.id;
          const itemId = req.params.itemId;
      
          const cart = await Cart.findOne({ user: userId });
          if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
          }
      
          cart.cartItems = cart.cartItems.filter((item) => item._id.toString() !== itemId);
          await cart.save();
      
          return res.status(200).json({ success: true, cart: cart.cartItems });
        } catch (error) {
          console.error('Error deleting cart item:', error);
          return res.status(500).json({ success: false, message: 'Failed to delete item' });
        }
      };


exports.updateCartItemQuantity = async (req, res) => {
  const { cartItemId } = req.params; // ID of the cart item to update
  const { quantity } = req.body; // New quantity for the cart item
  const userId = req.user.id; // ID of the logged-in user

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Find the specific cart item by its ID
    const cartItem = cart.cartItems.find(item => item._id.toString() === cartItemId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in the cart' });
    }

    // Update the quantity of the cart item
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }
    cartItem.quantity = quantity;

    // Save the updated cart
    await cart.save();

    // Return the updated cart to the client
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return res.status(500).json({ success: false, message: 'Failed to update cart item quantity' });
  }
};

    
//     exports.createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { items, shippingInfo, totalAmount, paymentMethod } = req.body;

//     // Insert order into the collection
//     const order = await Order.create({
//       user: userId,
//       orderLine: items.map(item => ({
//         product: item.product,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         image: item.image,
//       })),
//       shippingInfo,
//       totalPrice: totalAmount,
//       paymentInfo: {
//         id: paymentMethod.id || null,
//         status: paymentMethod.status || null,
//       },
//       orderStatus: 'Processing',
//     });

//     return res.status(201).json({
//       success: true,
//       message: 'Order created successfully.',
//       order,
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      const { items, shippingInfo, totalAmount, paymentMethod } = req.body;
  
      // Insert order into the collection
      const order = await Order.create({
        user: userId,
        orderLine: items.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo,
        totalPrice: totalAmount,
        paymentInfo: {
          id: paymentMethod.id || null,
          status: paymentMethod.status || null,
        },
        orderStatus: 'Processing',
      });
  
      return res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        order,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.createTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const userId = req.user.id;
      const { paymentMethod } = req.body;
  
      // Retrieve user's cart
      const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
      if (!cart || cart.cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
  
      // Prepare order data
      let totalAmount = 0;
      const orderItems = cart.cartItems.map((item) => {
        totalAmount += item.quantity * item.price;
  
        // Validate stock
        if (item.product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.product.name}`);
        }
  
        // Reduce stock for the product
        item.product.stock -= item.quantity;
        item.product.save({ session });
  
        return {
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        };
      });
  
      // Create an order
      const order = new Order({
        user: userId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        status: 'Pending',
      });
  
      await order.save({ session });
  
      // Clear the user's cart
      cart.cartItems = [];
      await cart.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        success: true,
        message: 'Transaction completed successfully.',
        order,
      });
    } catch (error) {
      // Roll back the transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      console.error('Transaction failed:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  exports.createTransaction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const { paymentMethod, shippingInfo } = req.body; // Expect shippingInfo in the request body

        // Validate shipping info
        if (!shippingInfo || !shippingInfo.address || !shippingInfo.city || !shippingInfo.street || !shippingInfo.country) {
            throw new Error("All shipping information fields are required.");
        }

        // Retrieve user's cart
        const cart = await Cart.findOne({ user: userId }).populate('cartItems.product');
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Prepare order data
        let subtotal = 0;
        const orderItems = cart.cartItems.map((item) => {
            subtotal += item.quantity * item.price;

            // Validate stock
            if (item.product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product: ${item.product.name}`);
            }

            // Reduce stock for the product
            item.product.stock -= item.quantity;
            item.product.save({ session });

            return {
                product: item.product._id,
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            };
        });

        // Calculate total price
        const shippingFee = 50; // Example shipping fee
        const totalPrice = subtotal + shippingFee;

        // Create an order
        const order = new Order({
            user: userId,
            orderLine: orderItems,
            shippingInfo,
            subtotal,
            shippingFee,
            totalPrice,
            paymentInfo: { id: paymentMethod?.id || null, status: paymentMethod?.status || null }, // Optional payment info
        });

        await order.save({ session });

        // Clear the user's cart
        cart.cartItems = [];
        await cart.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: 'Transaction completed successfully.',
            order,
        });
    } catch (error) {
        // Roll back the transaction in case of an error
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction failed:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


exports.getOrders = async (req, res) => {
    try {
        // Fetch orders from the database (you can adjust the query as needed)
        const orders = await Order.find();  // This fetches all orders. Modify the query if you need filters

        // Check if orders are found. 'orders' will never be null because an empty array is returned if no orders are found.
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Successfully found orders, send them in the response
        res.status(200).json({
            message: 'Orders retrieved successfully',
            data: orders // Send orders in the response
        });
    } catch (error) {
        // Handle any errors that occur during fetching orders
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
        user: process.env.SMTP_EMAIL || '904cd0360be788',
        pass: process.env.SMTP_PASSWORD || 'f5003dc1789e00'
    }
  });
  
  const sendOrderStatusEmail = async (email, orderId, newStatus, orderItems, totalPrice) => {
    if (!email) {
        console.error('No email address provided!');
        return;
    }

    // Construct the order items table for the email body
    let orderItemsHTML = '';
    let subtotal = 0;

    orderItems.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        orderItemsHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    // Email content with a formatted receipt
    const mailOptions = {
        from: '"Your Company" <your-email@example.com>',
        to: email, // Ensure the email is provided
        subject: `Order #${orderId} Status Updated`,
        text: `Your order #${orderId} has been updated to "${newStatus}".
        
        Order Items:
        --------------------------------
        ${orderItems.map(item => `${item.name} x${item.quantity} - $${item.price * item.quantity}`).join("\n")}
        
        Subtotal: $${subtotal.toFixed(2)}
        Total: $${totalPrice.toFixed(2)}

        Thank you for shopping with us!`,
        html: `
            <h3>Your Order ID: ${orderId}</h3>
            <p>Status: ${newStatus}</p>
            <h4>Order Items:</h4>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHTML}
                </tbody>
            </table>
            <h4>Summary:</h4>
            <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
            <p>Thank you for shopping with us!</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { newStatus } = req.body;
        const { id } = req.params;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        // Populate the 'user' field and 'orderLine.product' (to get product details)
        const order = await Order.findById(id)
            .populate('user') // Populate the user field
            .populate('orderLine.product'); // Populate the product details in orderLine
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Update the order status
        order.orderStatus = newStatus;
        await order.save();

        // Extract the order items (product details)
        const orderItems = order.orderLine.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }));

        // Calculate the total price
        const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

        // Send email notification to the user
        if (order.user && order.user.email) {  // Ensure the email exists
            await sendOrderStatusEmail(order.user.email, order._id, newStatus, orderItems, totalPrice);
        } else {
            console.error('User email not found.');
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${newStatus}.`,
            order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
