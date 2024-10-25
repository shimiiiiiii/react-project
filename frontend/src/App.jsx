import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import './App.css'

import Login from './Components/User/Login';
import Register from './Components/User/Register';
import NewProduct from './Components/Admin/NewProduct';
import NewSupplier from './Components/Admin/NewSupplier';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route path="/admin/supplier/new" element={<NewSupplier />} />
          </Routes>
      </Router>
    </div>
  )
}

export default App
