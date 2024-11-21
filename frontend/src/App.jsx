import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import './App.css'
import Dashboard from './Components/Design/Dashboard';

// USER CRUDS
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import EditProfile from './Components/User/EditProfile';

// ADMIN CRUDS
import NewProduct from './Components/Admin/NewProduct';
import EditProduct from './Components/Admin/EditProduct';
import NewVariety from './Components/Admin/NewSupplier';
import EditVariety from './Components/Admin/EditVariety';

// DATATABLES
import VarietyDataTable from "./Components/Admin/VarietyDataTable";

// import SupplierDataTable from "./Components/Admin/SupplierDataTable";
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
              <Route path="/profile/update" element={<EditProfile />} />

              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route path="/admin/product/:id" element={<EditProduct />} />
              
              {/* <Route path="/admin/supplier" element={<SupplierDataTable />} /> */}

              <Route path="/admin/varieties" element={<VarietyDataTable />} />
              <Route path="/admin/variety/new" element={<NewVariety />} />
              <Route path="/admin/variety/:id" element={<EditVariety />} />
          </Routes>
      </Router>
    </div>
    
  )
}

export default App
