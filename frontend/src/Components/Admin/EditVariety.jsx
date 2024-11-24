import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken } from '../../utils/helpers'; 

const EditVariety = ({ variety, onClose, onUpdate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialize state when `variety` prop changes
    useEffect(() => {
        if (variety) {
            setName(variety.name || '');
            setDescription(variety.description || '');
            setOldImages(variety.images || []);
        }
    }, [variety]);

    const onChange = (e) => {
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

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            toast.error('Name and description are required');
            return;
        }

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        images.forEach((image) => formData.append('images', image));

        try {
            setLoading(true);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/variety/${variety.id}`, formData, config);

            if (data.success) {
                toast.success('Variety updated successfully!');
                if (onUpdate) onUpdate(data.updatedVariety); 
                if (onClose) onClose(); 
            } else {
                toast.error('Failed to update variety');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update variety');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={submitHandler}>
            <Typography variant="h4" gutterBottom>
                Edit Variety
            </Typography>
            <TextField
                label="Variety Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
                disabled={loading}
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                required
                multiline
                rows={4}
                disabled={loading}
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
                    onChange={onChange}
                    multiple
                />
            </Button>
            {oldImages.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Existing Images:</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {oldImages.map((img, idx) => (
                            <img key={idx} src={img.url} alt="Existing" style={{
                                width: 70,
                                height: 70,
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }} />
                        ))}
                    </Box>
                </Box>
            )}
            {imagesPreview.length > 0 && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Image Previews:</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {imagesPreview.map((img, idx) => (
                        <img key={idx} src={img} alt="Preview" style={{
                            width: 70,
                            height: 70,
                            objectFit: 'cover',
                            borderRadius: '4px',
                        }} />
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
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Update Variety'}
            </Button>
        </Box>
    );
};

export default EditVariety;
