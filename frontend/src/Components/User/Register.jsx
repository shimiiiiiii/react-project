import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Meta from '../Layout/Meta';
import axios from 'axios';
import { auth, createUserWithEmailAndPassword } from '../../utils/firebase.js';
import DatePicker from 'react-datepicker'; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import the necessary CSS
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';

const Register = () => {
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(10, 'Password cannot exceed 10 characters')
            .required('Password is required'),
        dateOfBirth: Yup.date().nullable().required('Birthdate is required'),
       
        photo: Yup.mixed().required('Profile photo is required'),
    });

    const registerUser = async (userData) => {
        try {
            setLoading(true);
            // Register with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const firebaseToken = await userCredential.user.getIdToken();

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${firebaseToken}`,
                },
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API}/register`, userData, config);
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.log(error.message);
        }
    };

    return (
        <>
            <Meta title={'Register User'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            password: '',
                            dateOfBirth: null,
                            photo: null,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            const formData = new FormData();
                            formData.append('name', values.name);
                            formData.append('email', values.email);
                            formData.append('password', values.password);
                            formData.append('dateOfBirth', values.dateOfBirth);
                            if (photo) formData.append('photo', photo);
                            registerUser(formData);
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                            <Form className="shadow-lg" encType="multipart/form-data">
                                <h1 className="mb-3">Register</h1>

                                <Field
                                    as={TextField}
                                    label="Name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    fullWidth
                                    margin="normal"
                                />

                                <Field
                                    as={TextField}
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    fullWidth
                                    margin="normal"
                                />

                                <Field
                                    as={TextField}
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    fullWidth
                                    margin="normal"
                                />

                                <div className="form-group">
                                    <label htmlFor="date_of_birth" style={{ display: 'block' }}>Date of Birth</label>
                                    <DatePicker
                                        selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                                        onChange={(date) => setFieldValue('dateOfBirth', date.toISOString().split('T')[0])}
                                        dateFormat="yyyy-MM-dd"
                                        className={`form-control ${touched.dateOfBirth && errors.dateOfBirth ? 'is-invalid' : ''}`}
                                    />
                                    {touched.dateOfBirth && errors.dateOfBirth && (
                                        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                                            {errors.dateOfBirth}
                                        </Typography>
                                    )}
                                </div>
                    
                                <div className="form-group">
                                    <label htmlFor="photo_upload">Profile Photo</label>
                                    <input
                                        type="file"
                                        name="photo"
                                        className="form-control"
                                        id="photo_upload"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setPhoto(file);

                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                if (reader.readyState === 2) {
                                                    setPhotoPreview(reader.result);
                                                    setFieldValue('photo', file);
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    {touched.photo && errors.photo && (
                                        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                                            {errors.photo}
                                        </Typography>
                                    )}
                                    {photoPreview && (
                                        <img src={photoPreview} alt="Photo Preview" className="mt-3" width="55" height="52" />
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ marginTop: 3 }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Register'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default Register;
