import React, { useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewVariety = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach(image => {
            formData.append('images', image);
        });

        createVariety(formData);
    };

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);

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

    const createVariety = async (formData) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`http://localhost:4000/api/admin/variety/new`, formData, config);
            setLoading(false);
            setSuccess(data.success);
        } catch (error) {
            setLoading(false);
            setError(error.response ? error.response.data.message : error.message);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
        }

        if (success) {
            toast.success('Variety created successfully', { position: 'bottom-right' });
        }
    }, [error, success]);

    return (
        <>
            <Meta title={'New Variety'} />
            <div className="container mt-5">
                <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                    <h1 className="mb-4">New Variety</h1>

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description_field">Description</label>
                        <textarea
                            className="form-control"
                            id="description_field"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Images</label>
                        <div className="custom-file">
                            <input
                                type="file"
                                name="images"
                                className="custom-file-input"
                                id="customFile"
                                onChange={onChange}
                                multiple
                            />
                            <label className="custom-file-label" htmlFor="customFile">
                                Choose Images
                            </label>
                        </div>

                        {imagesPreview.map(img => (
                            <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                        ))}
                    </div>

                    <button
                        id="submit_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading}
                    >
                        CREATE
                    </button>
                </form>
            </div>
        </>
    );
};

export default NewVariety;
