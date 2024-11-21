import React, { useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewSupplier = () => {
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('contactNumber', contactNumber);
        formData.set('email', email);
        formData.set('address', address);

        images.forEach(image => {
            formData.append('images', image);
        });

        createSupplier(formData);
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

    const createSupplier = async (formData) => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`http://localhost:4000/api/admin/supplier/new`, formData, config);
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
            toast.success('Supplier created successfully', { position: 'bottom-right' });
        }
    }, [error, success]);

    return (
        <>
            <Meta title={'New Supplier'} />
            <div className="container mt-5">
                <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                    <h1 className="mb-4">New Supplier</h1>

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
                        <label htmlFor="contact_field">Contact Number</label>
                        <input
                            type="text"
                            id="contact_field"
                            className="form-control"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address_field">Address</label>
                        <textarea
                            className="form-control"
                            id="address_field"
                            rows="4"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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

export default NewSupplier;
