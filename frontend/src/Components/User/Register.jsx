import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Meta from '../Layout/Meta';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
    });

    const { name, email, password } = user;
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            console.log(error);
            setError('');
        }
    }, [error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('dateOfBirth', user.dateOfBirth);
        if (photo) formData.append('photo', photo);

        register(formData);
    };

    const onChange = (e) => {
        if (e.target.name === 'photo') {
            const file = e.target.files[0];
            setPhoto(file);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setPhotoPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const register = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post(`http://localhost:4000/api/register`, userData, config);
            console.log(data.user);
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
            console.log(error.response.data.message);
        }
    };

    return (
        <>
            <Meta title={'Register User'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name="password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                type="date"
                                id="date_of_birth"
                                className="form-control"
                                name="dateOfBirth"
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="photo_upload">Profile Photo</label>
                            <input
                                type="file"
                                name="photo"
                                className="form-control"
                                id="photo_upload"
                                accept="image/*"
                                onChange={onChange}
                            />
                            {photoPreview && (
                                <img src={photoPreview} alt="Photo Preview" className="mt-3" width="55" height="52" />
                            )}
                        </div>

                        <button id="register_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
