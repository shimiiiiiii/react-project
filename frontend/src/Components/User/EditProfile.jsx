import React, { useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';

const EditProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
            const { data } = await axios.get(`http://localhost:4000/api/profile`, config);
            setName(data.user.name);
            setEmail(data.user.email);
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
            const { data } = await axios.put(`http://localhost:4000/api/profile/update`, userData, config);
            toast.success('Profile updated', { position: 'bottom-right' });
            navigate('/me', { replace: true });
        } catch (error) {
            toast.error('Error updating profile', { position: 'bottom-right' });
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
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
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                        <h1 className="mt-2 mb-5">Edit Profile</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="photo_upload">Photo</label>
                            <div className="d-flex align-items-center">
                                <figure className="avatar mr-3 item-rtl">
                                    <img src={photoPreview} className="rounded-circle" alt="Photo Preview" />
                                </figure>
                                <input
                                    type="file"
                                    name="photo"
                                    className="custom-file-input"
                                    id="customFile"
                                    accept="image/*"
                                    onChange={onChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Photo
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading}>
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
