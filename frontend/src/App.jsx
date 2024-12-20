
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import './App.css'


// import Dashboard from './Components/Design/Dashboard';
// import Header from './Components/UI/Header';
// import HeroSection from './Components/UI/HeroSection';
// import Menugrid from './Components/UI/Menugrid';

import CustomNavbar from './Components/UI/NavBar';
import Home from './Components/UI/Home';
import Menu from './Components/UI/Menu';

// USER CRUDS
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import EditProfile from './Components/User/EditProfile';

// ADMIN CRUDS
// import NewProduct from './Components/Admin/NewProduct';
// import EditProduct from './Components/Admin/EditProduct';
// import NewVariety from './Components/Admin/NewVariety';
// import EditVariety from './Components/Admin/EditVariety';
import Dashboard from './Components/Admin/Dashboard';
import SalesCharts from './Components/Admin/SalesCharts';

// ADMIN DATATABLES
import VarietyDataTable from "./Components/Admin/VarietyDataTable";
import ProductDataTable from "./Components/Admin/ProductDataTable";

// DETAILS
import ProductDetails from './Components/UI/ProductModal';
import VarietyDetail from './Components/UI/ProductVarietyDetail'; 
import Orders from './Components/Admin/OrderStatus';
import MyOrders from './Components/User/MyOrders';
import ViewOrderDetails from './Components/User/ViewOrderDetails';
// import WriteReview from './Components/User/WriteReview';


import Chart from './Components/Admin/SalesCharts';
import Charts from './Components/Admin/SalesCharts';
import ProtectedRoute from './Components/Route/ProtectedRoute';

function App() {

  return (
    <div className="App">
    <ToastContainer />
      <Router>
          <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/update" element={<EditProfile />} />

              <Route path="/menu" element={<Menu />} />
              <Route path="/product/details" element={<ProductDetails />} />
              <Route path="/products/variety/:varietyId" element={<VarietyDetail />} />
              
              {/* <Route path="/admin/products" element={<ProductDataTable />} /> */}
              {/* <Route path="/admin/varieties" element={<VarietyDataTable />} /> */}
              {/* <Route path="/charts" element={<Chart />} /> */}
{/*     
              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route path="/admin/product/:id" element={<EditProduct />} />
              <Route path="/admin/variety/new" element={<NewVariety />} />
              <Route path="/admin/variety/:id" element={<EditVariety />} /> */}
              {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/admin/sales" element={<SalesCharts />} /> */}

              {/* <Route path="/orders" element={<Orders />} /> */}
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<ViewOrderDetails />} />
              {/* <Route path="/order/:orderId/review" element={<WriteReview />} /> */}

              <Route
            path="/charts"
            element={
              <ProtectedRoute isAdmin={true}>
                <Charts />
              </ProtectedRoute>
            }
          />
                <Route
            path="/admin/varieties"
            element={
              <ProtectedRoute isAdmin={true}>
                <VarietyDataTable />
              </ProtectedRoute>
            }
          />

        <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAdmin={true}>
                <ProductDataTable />
              </ProtectedRoute>
            }
          />
             <Route
            path="/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <Orders />
              </ProtectedRoute>
            }
          />

          </Routes>
      </Router>
    </div>
    
  )
}

export default App
