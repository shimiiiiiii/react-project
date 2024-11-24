import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const NewProduct = ({ onClose, onSuccess }) => {
  const [varietyList, setVarietyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  useEffect(() => {
    const fetchVarieties = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        };
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/varieties`,
          config
        );
        setVarietyList(data.varieties || []);
      } catch (error) {
        toast.error('Failed to fetch varieties');
      }
    };
    fetchVarieties();
  }, []);

  const onChangeImages = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    description: Yup.string().required('Description is required'),
    variety: Yup.string().required('Variety is required'),
    stock: Yup.number()
      .required('Stock is required')
      .integer('Stock must be a whole number')
      .min(0, 'Stock cannot be negative'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
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

      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/admin/product/new`,
        formData,
        config
      );

      if (data.success) {
        toast.success('Product created successfully!');
        if (onSuccess) onSuccess(data.product);
        if (onClose) onClose();
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <Formik
        initialValues={{
          name: '',
          price: '',
          description: '',
          variety: '',
          stock: '',
          images: [],
        }}
        validationSchema={validationSchema}
        validate={(values) => {
          const errors = {};
          if (images.length === 0) {
            errors.images = 'At least one image is required';
          }
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              label="Product Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            <Field
              as={TextField}
              label="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && Boolean(errors.price)}
              helperText={touched.price && errors.price}
              fullWidth
              margin="normal"
              type="number"
              disabled={loading}
            />
            <Field
              as={TextField}
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              disabled={loading}
            />
            <Field
              as={TextField}
              label="Variety"
              name="variety"
              select
              value={values.variety}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.variety && Boolean(errors.variety)}
              helperText={touched.variety && errors.variety}
              fullWidth
              margin="normal"
              disabled={loading}
            >
              {varietyList.map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.name}
                </MenuItem>
              ))}
            </Field>
            <Field
              as={TextField}
              label="Stock"
              name="stock"
              value={values.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.stock && Boolean(errors.stock)}
              helperText={touched.stock && errors.stock}
              fullWidth
              margin="normal"
              type="number"
              disabled={loading}
            />
            <Button
              variant="contained"
              component="label"
              sx={{ marginTop: 2 }}
              disabled={loading}
            >
            Upload Images
            <input type="file" hidden onChange={(e) => {
                    onChangeImages(e);
                    if (errors.images) delete errors.images; // clear error if uploaded
                }}
                multiple 
            />
            </Button>
            {errors.images && touched.images && (
                <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                {errors.images}
                </Typography>
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
              {loading || isSubmitting ? <CircularProgress size={24} /> : 'Create Product'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewProduct;
