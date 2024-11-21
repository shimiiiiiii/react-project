import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Login.css';
import Loader from '../Layout/Loader';
import Meta from '../Layout/Meta';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { authenticate } from '../../utils/helpers';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase'; // Import from firebase.js
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Register from './Register'; // Import the Register component

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Modal state for the registration form
    const [openRegister, setOpenRegister] = useState(false);

    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            setLoading(true);

            // Step 1: Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Step 2: Get Firebase token   
            const firebaseToken = await userCredential.user.getIdToken();

            // Step 3: Send Firebase token to backend for JWT creation
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${firebaseToken}`,
                },
            };

            const { data } = await axios.post(`http://localhost:4000/api/login`, { email, password }, config);
            console.log(data);
            authenticate(data, () => navigate("/"));
        } catch (error) {
            toast.error("Invalid user or password", {
                position: "bottom-right"
            });
        } finally {
            setLoading(false);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password);
    };

    // Open the registration modal
    const handleOpenRegister = () => {
        setOpenRegister(true);
    };

    // Close the registration modal
    const handleCloseRegister = () => {
        setOpenRegister(false);
    };

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <Meta title={'Login'} />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
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
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="form-actions">
                                    <Link to="/password/forgot" className="forgot-password">Forgot Password?</Link>
                                    <Link to="#" onClick={handleOpenRegister} className="new-user">New User?</Link>
                                </div>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    LOGIN
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Register Modal */}
                    <Modal open={openRegister} onClose={handleCloseRegister}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <Register handleClose={handleCloseRegister} />
                        </Box>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Login;
