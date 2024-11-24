import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Collapse, Checkbox } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import NewProduct from './NewProduct';
import EditProduct from './EditProduct';

const ProductDataTable = () => {
    const [products, setProducts] = useState([]);
    const [varieties, setVarieties] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openNewProduct, setOpenNewProduct] = useState(false);
    const [openEditProduct, setOpenEditProduct] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                };

                const { data: productData } = await axios.get(
                    `${import.meta.env.VITE_API}/products`,
                    config
                );
                setProducts(productData.products);

                const { data: varietyData } = await axios.get(
                    `${import.meta.env.VITE_API}/varieties`,
                    config
                );
                setVarieties(varietyData.varieties);
            } catch (error) {
                toast.error('Failed to fetch products or varieties');
            }
        };

        fetchData();
    }, []);

    const handleOpenNew = () => setOpenNewProduct(true);
    const handleCloseNew = () => setOpenNewProduct(false);
    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setOpenEditProduct(true);
    };
    const handleCloseEdit = () => {
        setSelectedProduct(null);
        setOpenEditProduct(false);
    };

    const handleDelete = async (id) => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };

        try {
            await axios.delete(`${import.meta.env.VITE_API}/admin/product/${id}`, config);
            setProducts(products.filter((product) => product._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleBulkDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        };

        try {
            await axios.post(
                `${import.meta.env.VITE_API}/admin/product/bulk-delete`,
                { ids: selectedRows },
                config
            );
            setProducts(products.filter((product) => !selectedRows.includes(product._id)));
            setSelectedRows([]);
            toast.success('Selected products deleted successfully');
        } catch (error) {
            toast.error('Failed to delete selected products');
        }
    };

    const toggleRowExpansion = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getVarietyName = (varietyId) => {
        const variety = varieties.find((v) => v._id === varietyId);
        return variety ? variety.name : 'Unknown';
    };

    const rows = products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        variety: product.variety,
        images: product.images || [],
        createdAt: product.createdAt,
    }));

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Products
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleOpenNew}
                    sx={{ mr: 2 }}
                >
                    Add New Product
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleBulkDelete}
                    disabled={selectedRows.length === 0}
                >
                    Delete Selected
                </Button>
            </Box>
            <Box sx={{ height: 500, width: '100%' }}>
                {rows.map((row) => (
                    <Box key={row.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #ddd',
                                padding: '10px 20px',
                            }}
                        >
                            <Checkbox
                                checked={selectedRows.includes(row.id)}
                                onChange={() => {
                                    const newSelectedRows = selectedRows.includes(row.id)
                                        ? selectedRows.filter((id) => id !== row.id)
                                        : [...selectedRows, row.id];
                                    setSelectedRows(newSelectedRows);
                                }}
                            />
                            <Typography sx={{ width: 150 }}>{row.name}</Typography>
                            <Typography sx={{ width: 100 }}>{row.price}</Typography>
                            <Typography sx={{ width: 100 }}>{row.stock}</Typography>
                            <Typography sx={{ width: 150 }}>{getVarietyName(row.variety)}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', width: 150 }}>
                                {row.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.url}
                                        alt={`Product Image ${index + 1}`}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            objectFit: 'cover',
                                            marginRight: '5px',
                                            marginBottom: '5px',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ))}
                            </Box>
                            <Box>
                                <IconButton onClick={() => handleOpenEdit(row)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Box>
                            <IconButton onClick={() => toggleRowExpansion(row.id)}>
                                {expandedRows[row.id] ? '-' : '+'}
                            </IconButton>
                        </Box>
                        <Collapse in={expandedRows[row.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ padding: '10px 20px', backgroundColor: '#f9f9f9' }}>
                                <Typography>
                                    <strong>Product ID:</strong> {row.id}
                                </Typography>
                                <Typography>
                                    <strong>Description:</strong> {row.description}
                                </Typography>
                                <Typography>
                                    <strong>Created At:</strong> {new Date(row.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Collapse>
                    </Box>
                ))}
            </Box>

            {/* New Product Modal */}
            <Dialog open={openNewProduct} onClose={handleCloseNew} fullWidth maxWidth="sm">
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <NewProduct
                        onClose={handleCloseNew}
                        onAdd={(newProduct) => setProducts([newProduct, ...products])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNew} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog open={openEditProduct} onClose={handleCloseEdit} fullWidth maxWidth="sm">
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    {selectedProduct ? (
                        <EditProduct
                            product={selectedProduct}
                            onClose={handleCloseEdit}
                            onUpdate={(updatedProduct) => {
                                setProducts(
                                    products.map((product) =>
                                        product._id === updatedProduct._id ? updatedProduct : product
                                    )
                                );
                            }}
                        />
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ProductDataTable;
