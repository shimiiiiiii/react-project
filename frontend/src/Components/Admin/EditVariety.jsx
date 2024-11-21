import React, { useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import 'react-toastify/dist/ReactToastify.css';

const EditVariety = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    const { id } = useParams();  // Fetch id from the URL params
    const navigate = useNavigate();

    // Show error message
    const errMsg = (message = '') => toast.error(message, { position: 'bottom-left' });
    // Show success message
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' });

    // Fetch variety details from the server
    const getVarietyDetails = async (id) => {
        if (!id) {
            errMsg('Variety ID is missing!');
            return;
        }
        try {
            const { data } = await axios.get(`http://localhost:4000/api/variety/${id}`);
            setName(data.variety.name);
            setDescription(data.variety.description);
            setOldImages(data.variety.images);
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            setUpdateError(error.response ? error.response.data.message : error.message);
        }
    };

    // Update variety data on the server
    const updateVariety = async (id, varietyData) => {
        if (!id) {
            errMsg('Invalid variety ID!');
            return;
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.put(`http://localhost:4000/api/admin/variety/${id}`, varietyData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setUpdateError(error.response ? error.response.data.message : error.message);
        }
    };

    // Handle image selection and preview
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

    // Submit updated variety data
    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach((image) => {
            formData.append('images', image);
        });

        updateVariety(id, formData);  // Use the id from useParams
    };

    // Use useEffect to trigger actions when the component mounts or changes
    useEffect(() => {
        if (updateError) {
            errMsg(updateError);
        }

        if (isUpdated) {
            successMsg('Variety updated successfully');
            navigate('/admin/varieties');  // Redirect to varieties list after successful update
        }

        if (id) {
            getVarietyDetails(id);  // Fetch variety details only if id is available
        } else {
            errMsg('Invalid or missing variety ID');
        }
    }, [id, updateError, isUpdated]);

    return (
        <>
            <Meta title="Edit Variety" />
            <div className="container mt-5">
                <form onSubmit={submitHandler} encType="multipart/form-data">
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
                        disabled={loading} // Disable input while loading
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
                        disabled={loading} // Disable input while loading
                    />

                    {/* Image upload input */}
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ marginTop: 2 }}
                        disabled={loading} // Disable button while loading
                    >
                        Upload New Images
                        <input
                            type="file"
                            hidden
                            onChange={onChange}
                            multiple
                            disabled={loading} // Disable file input while loading
                        />
                    </Button>

                    {/* Display existing images */}
                    {oldImages.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Existing Images:
                            </Typography>
                            {oldImages.map((img) => (
                                <img
                                    key={img.public_id}
                                    src={img.url}
                                    alt={img.url}
                                    width="55"
                                    height="52"
                                    style={{ marginRight: '10px' }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Display image previews */}
                    {imagesPreview.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle1" gutterBottom>
                                Image Previews:
                            </Typography>
                            {imagesPreview.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="Image Preview"
                                    width="55"
                                    height="52"
                                    style={{ marginRight: '10px' }}
                                />
                            ))}
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
                </form>
            </div>
        </>
    );
};

export default EditVariety;
