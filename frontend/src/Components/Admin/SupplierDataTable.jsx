// SupplierDataTable.jsx

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SupplierForm from './NewSupplier'; 
import axios from 'axios';

const SupplierDataTable = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/suppliers');
            console.log('API Response:', response.data); 
            
            if (response.data && response.data.suppliers) {
                const suppliersWithId = response.data.suppliers.map(supplier => ({
                    ...supplier,
                    id: supplier._id 
                }));
                setSuppliers(suppliersWithId);
            } else {
                console.error('Suppliers data is undefined or not found');
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };
    
    const handleOpen = () => {
        setSelectedSupplier(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/admin/supplier/${id}`);
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'contactNumber', headerName: 'Contact Number', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'address', headerName: 'Address', width: 200 },
        {
            field: 'images',
            headerName: 'Images',
            width: 300,
            renderCell: (params) => (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                    {params.value && params.value.length > 0 ? (
                        params.value.map((image) => (
                            <img 
                                key={image._id} 
                                src={image.url} 
                                alt="Supplier" 
                                style={{ width: 50, height: 50, objectFit: 'cover' }} 
                            />
                        ))
                    ) : (
                        <span>No images available</span>
                    )}
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(params.row)}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: 16 }}>
                Add Supplier
            </Button>
            <DataGrid rows={suppliers} columns={columns} pageSize={5} checkboxSelection />
            {open && (
                <SupplierForm
                    supplierId={selectedSupplier ? selectedSupplier.id : null}
                    onFormSubmit={() => {
                        fetchSuppliers();
                        handleClose();
                    }}
                />
            )}
        </div>
    );
};

export default SupplierDataTable;
