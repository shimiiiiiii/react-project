import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import Meta from '../Layout/Meta';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import 'react-toastify/dist/ReactToastify.css';

const NewVariety = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach(image => {
            formData.append('images', image);
        });

        setLoading(true);
        createVariety(formData);
    };

    const createVariety = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`http://localhost:4000/api/admin/variety/new`, formData, config);
            toast.success('Variety created successfully');
            onSuccess();  // Trigger onSuccess to refresh the variety data or close the modal
            onClose();    // Close the modal
        } catch (error) {
            toast.error(error.response?.data.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);  // Reset preview
        setImages([]);  // Reset images array

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
        }
    }, [error]);

    return (
        <Box>
            <Meta title={'New Variety'} />
            <form onSubmit={submitHandler} encType="multipart/form-data" className="shadow-lg p-4">
                <h1 className="mb-4">New Variety</h1>

                <TextField
                    label="Variety Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
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
                />

                {/* Image upload input */}
                <Button variant="contained" component="label" sx={{ marginTop: 2 }}>
                    Upload Images
                    <input
                        type="file"
                        hidden
                        onChange={onChange}
                        multiple
                    />
                </Button>

                <Box mt={2}>
                    {/* Display image previews if any */}
                    {imagesPreview.length > 0 && imagesPreview.map((img, index) => (
                        <img key={index} src={img} alt="Preview" width="55" height="52" style={{ marginRight: '10px' }} />
                    ))}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    disabled={!name || !description || loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
            </form>
        </Box>
    );
};

export default NewVariety;
