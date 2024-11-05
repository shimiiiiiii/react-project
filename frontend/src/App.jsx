import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import './App.css'
import Dashboard from './Components/Design/Dashboard';

import Login from './Components/User/Login';
import Register from './Components/User/Register';
// import EditProfile from './Components/User/EditProfile';

import NewProduct from './Components/Admin/NewProduct';
import EditProduct from './Components/Admin/EditProduct';
import NewSupplier from './Components/Admin/NewSupplier';
import EditSupplier from './Components/Admin/EditSupplier';

import SupplierDataTable from "./Components/Admin/SupplierDataTable";
// import SupplierForm from "./Components/Admin/SupplierForm.jsx"; 

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/profile/update" element={<EditProfile />} /> */}

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
