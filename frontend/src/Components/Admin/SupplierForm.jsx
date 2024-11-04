// Components/Admin/SupplierForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupplierForm = ({ supplierId, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        email: '',
        address: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (supplierId) {
            axios.get(`/api/admin/supplier/${supplierId}`)
                .then(response => {
                    setFormData(response.data.supplier);
                })
                .catch(error => {
                    console.error('Failed to fetch supplier details:', error);
                });
        }
    }, [supplierId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (supplierId) {
                await axios.put(`/admin/supplier/${supplierId}`, formData);
            } else {
                await axios.post('//api/admin/supplier/new', formData);
            }

            onFormSubmit();
            navigate('/supplier');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Contact Number:</label>
                <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">{supplierId ? 'Update' : 'Add'} Supplier</button>
        </form>
    );
};

export default SupplierForm;
