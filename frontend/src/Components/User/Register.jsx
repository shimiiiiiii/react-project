import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Meta from '../Layout/Meta';
import axios from 'axios';
import '../CSS/Register.css';
import { auth, createUserWithEmailAndPassword } from '../../utils/firebase.js';
import DatePicker from 'react-datepicker'; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import the necessary CSS

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '', // Keep the format yyyy-mm-dd
    });

    const { name, email, password, dateOfBirth } = user;
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
    }, [error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('dateOfBirth', dateOfBirth); // Send the date as yyyy-mm-dd
        if (photo) formData.append('photo', photo);

        await register(formData);
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

    const handleDateChange = (date) => {
        // Format the date to yyyy-mm-dd
        const formattedDate = date.toISOString().split('T')[0];
        setUser({ ...user, dateOfBirth: formattedDate });
    };

    const register = async (userData) => {
        try {
            setLoading(true);

            // Step 1: Register with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Step 2: Get Firebase token for authentication
            const firebaseToken = await userCredential.user.getIdToken();

            // Step 3: Send Firebase token and user data to backend
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // multipart for FormData
                    Authorization: `Bearer ${firebaseToken}`,
                },
            };

            const { data } = await axios.post('http://localhost:4000/api/register', userData, config);
            console.log(data.user);
            setLoading(false);
            navigate('/');
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
                                required
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
                                required
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
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <DatePicker
                                selected={dateOfBirth ? new Date(dateOfBirth) : null}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd" // Ensure the date is displayed in yyyy-mm-dd format
                                className="form-control"
                                required
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
                            {loading ? "Registering..." : "REGISTER"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
