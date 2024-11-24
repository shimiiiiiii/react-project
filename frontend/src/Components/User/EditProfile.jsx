import React, { useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
    Avatar,
    IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const EditProfile = () => {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [photoPreview, setPhotoPreview] = useState('/images/default_avatar.jpg');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/profile`, config);
            setName(data.user.name);
            setPhotoPreview(data.user.photo?.url || '/images/default_avatar.jpg');
            setLoading(false);
        } catch (error) {
            toast.error('User not found', { position: 'bottom-right' });
        }
    };

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API}/profile/update`, userData, config);
            toast.success('Profile updated', { position: 'bottom-right' });
            navigate('/', { replace: true });
        } catch (error) {
            toast.error('Error updating profile', { position: 'bottom-right' });
        }
    };

    const logout = () => {
        // Clear the token, firebase key, and user key from sessionStorage or localStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('firebase');
        sessionStorage.removeItem('user');
        
        // You can also use localStorage if needed
        // localStorage.removeItem('token');
        // localStorage.removeItem('firebase');
        // localStorage.removeItem('user');
    
        toast.success('Logged out successfully', { position: 'bottom-right' });
    
        // Perform a full page reload and redirect to the home page
        window.location.href = '/'; // Redirect to the home page
        window.location.reload(); // Reload the page to ensure the session is cleared
    };

    useEffect(() => {
        getProfile();
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the submit button is clicked
        const formData = new FormData();
        formData.set('name', name);
        formData.set('photo', photo);
        updateProfile(formData);
    };

    const onChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPhotoPreview(reader.result);
                setPhoto(e.target.files[0]);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <>
            <Meta title="Edit Profile" />
            <Container maxWidth="sm">
                <Box
                    component="form"
                    onSubmit={submitHandler}
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: 3,
                        padding: 4,
                        borderRadius: 2,
                        mt: 4,
                    }}
                    encType="multipart/form-data"
                >
                    <Typography variant="h4" gutterBottom>
                        Edit Profile
                    </Typography>

                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                    />

                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar
                            src={photoPreview}
                            alt="Photo Preview"
                            sx={{ width: 80, height: 80, mx: 'auto' }}
                        />
                        <label htmlFor="upload-photo">
                            <input
                                type="file"
                                id="upload-photo"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={onChange}
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                sx={{ mt: 1 }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Update'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={logout}
                    >
                        Log Out
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default EditProfile;
