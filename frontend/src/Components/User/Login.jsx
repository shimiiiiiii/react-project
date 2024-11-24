import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/Login.css';
import Loader from '../Layout/Loader';
import Meta from '../Layout/Meta';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { authenticate } from '../../utils/helpers';
import { 
    auth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    signInWithPopup,
    signInWithRedirect, 
    getRedirectResult 
} from '../../utils/firebase';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Register from './Register';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress } from '@mui/material';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const navigate = useNavigate();

    // Schema validation for login form
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // Login handler for email/password
    const login = async (email, password) => {
        try {
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseToken = await userCredential.user.getIdToken();

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${firebaseToken}`,
                },
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API}/login`, { email, password }, config);
            authenticate(data, () => navigate("/"));
        } catch (error) {
            toast.error("Invalid user or password", {
                position: "bottom-right",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            const firebaseToken = await user.getIdToken();
            console.log("Google Firebase Token:", firebaseToken);
    
            // Send Firebase token to backend for validation
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseToken}`,
                },
            };
    
            const { data } = await axios.post(`${import.meta.env.VITE_API}/login`, { email: user.email }, config);
    
            // Store backend token and user data, then redirect
            authenticate({ token: data.token, user: data.user, firebaseToken }, () => navigate("/"));
        } catch (error) {
            console.error("Google login failed:", error);
            errMsg("Google login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFacebookLogin = async () => {
        try {
            setLoading(true);
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            const firebaseToken = await user.getIdToken();
            console.log("Facebook Firebase Token:", firebaseToken);
    
            // Send Firebase token to backend for validation
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${firebaseToken}`,
                },
            };
    
            const { data } = await axios.post(`${import.meta.env.VITE_API}/login`, { email: user.email }, config);
    
            // Store backend token and user data, then redirect
            authenticate({ token: data.token, user: data.user, firebaseToken }, () => navigate("/"));
        } catch (error) {
            console.error("Facebook login failed:", error);
            errMsg("Facebook login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Submit handler for form login
    const submitHandler = (values) => {
        login(values.email, values.password);
    };

    const handleOpenRegister = () => {
        setOpenRegister(true);
    };

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
                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={validationSchema}
                                onSubmit={submitHandler}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                                    <Form className="shadow-lg">
                                        <h1 className="mb-3">Login</h1>

                                        <div className="form-group">
                                            <Field
                                                as={TextField}
                                                label="Email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                error={touched.email && Boolean(errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <Field
                                                as={TextField}
                                                label="Password"
                                                name="password"
                                                type="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                error={touched.password && Boolean(errors.password)}
                                                helperText={touched.password && errors.password}
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <Link to="/password/forgot" className="forgot-password">Forgot Password?</Link>
                                            <Link to="#" onClick={handleOpenRegister} className="new-user">New User?</Link>
                                        </div>

                                        <Button
                                            id="login_button"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            sx={{ py: 2 }}
                                            disabled={isSubmitting || loading}
                                        >
                                            {isSubmitting || loading ? <CircularProgress size={24} /> : 'LOGIN'}
                                        </Button>

                                        <div className="social-login">
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="primary"
                                                sx={{ my: 1 }}
                                                onClick={handleGoogleLogin}
                                            >
                                                Login with Google
                                            </Button>

                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ my: 1 }}
                                                onClick={handleFacebookLogin}
                                            >
                                                Login with Facebook
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
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
