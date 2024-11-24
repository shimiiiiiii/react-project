import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Typography, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getToken } from '../../utils/helpers';

const EditProduct = ({ product, onClose, onUpdate }) => {
    const [varietyList, setVarietyList] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVarieties = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API}/varieties`, config);
                setVarietyList(data.varieties || []);
            } catch (error) {
                toast.error('Failed to fetch varieties');
            }
        };
        fetchVarieties();
    }, []);

    useEffect(() => {
        if (product) {
            setOldImages(product.images || []);
        }
    }, [product]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        price: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
        description: Yup.string().required('Description is required'),
        variety: Yup.string().required('Variety is required'),
        stock: Yup.number().required('Stock is required').min(1, 'Stock must be greater than 0'),
    });

    const handleFileChange = (e, setFieldValue) => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((prev) => [...prev, reader.result]);
                    setImages((prev) => [...prev, reader.result]);
                    setFieldValue('images', [...images, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (values) => {
        if (!images.length && !oldImages.length) {
            toast.error('At least one image is required');
            return;
        }

        const formData = new FormData();
        formData.set('name', values.name);
        formData.set('price', values.price);
        formData.set('description', values.description);
        formData.set('variety', values.variety);
        formData.set('stock', values.stock);
        images.forEach((image) => formData.append('images', image));

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${product.id}`, formData, config);
            
            if (data.success) {
                toast.success('Product updated successfully!');
                if (onUpdate) onUpdate(data.updatedProduct);
                if (onClose) onClose();
            } else {
                toast.error(data.message || 'Failed to update product');
            }
        } catch (error) {
            // console.log(error.response?.data?.message); 
            // toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={{
                name: product?.name || '',
                price: product?.price || '',
                description: product?.description || '',
                variety: product?.variety || '',
                stock: product?.stock || '',
                images: [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                    <Typography variant="h4" gutterBottom>
                        Edit Product
                    </Typography>
                    <Field
                        name="name"
                        as={TextField}
                        label="Product Name"
                        fullWidth
                        margin="normal"
                        disabled={loading}
                        error={Boolean(touched.name && errors.name)}
                        helperText={<ErrorMessage name="name" />} 
                    />
                    <Field
                        name="price"
                        as={TextField}
                        label="Price"
                        fullWidth
                        margin="normal"
                        type="number"
                        disabled={loading}
                        error={Boolean(touched.price && errors.price)}
                        helperText={<ErrorMessage name="price" />} 
                    />
                    <Field
                        name="description"
                        as={TextField}
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        disabled={loading}
                        error={Boolean(touched.description && errors.description)}
                        helperText={<ErrorMessage name="description" />} 
                    />
                    <Field
                        name="variety"
                        as={TextField}
                        label="Variety"
                        select
                        fullWidth
                        margin="normal"
                        disabled={loading}
                        error={Boolean(touched.variety && errors.variety)}
                        helperText={<ErrorMessage name="variety" />} 
                    >
                        {varietyList.map((v) => (
                            <MenuItem key={v._id} value={v._id}>
                                {v.name}
                            </MenuItem>
                        ))}
                    </Field>
                    <Field
                        name="stock"
                        as={TextField}
                        label="Stock"
                        fullWidth
                        margin="normal"
                        type="number"
                        disabled={loading}
                        error={Boolean(touched.stock && errors.stock)}
                        helperText={<ErrorMessage name="stock" />} 
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ marginTop: 2 }}
                        disabled={loading}
                    >
                        Upload New Images
                        <input
                            type="file"
                            hidden
                            onChange={(e) => handleFileChange(e, setFieldValue)}
                            multiple
                        />
                    </Button>
                    {oldImages.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">Existing Images:</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {oldImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img.url}
                                        alt="Existing"
                                        style={{
                                            width: 70,
                                            height: 70,
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                    {imagesPreview.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1">Image Previews:</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {imagesPreview.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt="Preview"
                                        style={{
                                            width: 70,
                                            height: 70,
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 3 }}
                        disabled={loading || isSubmitting}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Update Product'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default EditProduct;
