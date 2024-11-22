
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import './App.css'
// import Dashboard from './Components/Design/Dashboard';

import Login from './Components/User/Login';
import Register from './Components/User/Register';
// import EditProfile from './Components/User/EditProfile';

import NewProduct from './Components/Admin/NewProduct';
import EditProduct from './Components/Admin/EditProduct';
import NewSupplier from './Components/Admin/NewSupplier';
import EditSupplier from './Components/Admin/EditSupplier';

import SupplierDataTable from "./Components/Admin/SupplierDataTable";
// import SupplierForm from "./Components/Admin/SupplierForm.jsx"; 

// import Header from './Components/UI/Header';
// import HeroSection from './Components/UI/HeroSection';
// import Menugrid from './Components/UI/Menugrid';

import CustomNavbar from './Components/UI/NavBar';
import Home from './Components/UI/Home';
import Menu from './Components/UI/Menu';
import ProductDetails from './Components/UI/ProductModal';


import VarietyDetail from './Components/UI/ProductVarietyDetail'; 


function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/details" element={<ProductDetails />} />
              <Route path="/menu" element={<Menu />} />
              {/* Add a route for the variety detail page */}
              <Route path="/products/variety/:varietyId" element={<VarietyDetail />} />
              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route path="/admin/product/:id" element={<EditProduct />} />
              
              <Route path="/admin/supplier" element={<SupplierDataTable />} />
              <Route path="/admin/supplier/new" element={<NewSupplier />} />
              <Route path="/admin/supplier/:id" element={<EditSupplier />} />
          </Routes>
      </Router>
    </div>
    
  )
}

export default App
