import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewSupplier = ({ user }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.isVerified) {
      setError('Access denied: Only admins can create suppliers.');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const supplierData = {
      name,
      contactNumber,
      email,
      address,
    };

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API}/admin/supplier/new`, supplierData, {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Pass the JWT token
        },
      });

      if (data.success) {
        setSuccess(true);
        setName('');
        setContactNumber('');
        setEmail('');
        setAddress('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create supplier');
    }
  };

  if (!user?.isVerified) {
    return <p style={{ color: 'red' }}>Access denied: Only verified users can create suppliers.</p>;
  }

  return (
    <div>
      <h2>Create New Supplier</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for name, contact number, email, and address */}
        <button type="submit">Create Supplier</button>
      </form>

      {success && <p>Supplier created successfully!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default NewSupplier;
