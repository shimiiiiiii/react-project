import React, { Fragment, useState, useEffect } from 'react';
import Meta from '../Layout/Meta';
// import SideBar from './SideBar';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const EditProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [variety, setVariety] = useState(''); 
    const [stock, setStock] = useState(0);
    const [supplier, setSupplier] = useState(''); 
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);

    const varieties = ['Classic', 'Premium', 'Supreme', 'Munchkins', 'Other'];

    const [suppliers, setSuppliers] = useState([]);
    
    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, { position: 'bottom-left' });
    const successMsg = (message = '') => toast.success(message, { position: 'bottom-right' });

    const getProductDetails = async (id) => {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/product/${id}`);
            setProduct(data.product);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const getSuppliers = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/suppliers`);
            setSuppliers(data.suppliers);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
            const { data } = await axios.put(`http://localhost:4000/api/admin/product/${id}`, productData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setUpdateError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (product && product._id !== id) {
            getProductDetails(id);
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setVariety(product.variety);
            setSupplier(product.supplier);
            setStock(product.stock);
            setOldImages(product.images);
        }
        
        if (error) {
            errMsg(error);
        }
        
        if (updateError) {
            errMsg(updateError);
        }
        
        if (isUpdated) {
            navigate('/admin/products');
            successMsg('Product updated successfully');
        }
    }, [error, isUpdated, updateError, product, id]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('variety', variety); 
        formData.set('stock', stock);
        formData.set('supplier', supplier); 
        images.forEach(image => {
            formData.append('images', image);
        });
        updateProduct(product._id, formData);
    };

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        setOldImages([]);
        
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
        getSuppliers();
    }, []);

    return (
        <>
            <Meta title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <SideBar /> */}
                </div>
                <div className="col-12 col-md-10">
                    <div className="wrapper my-5">
                        <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                            <h1 className="mb-4">Update Product</h1>
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
                                <label htmlFor="price_field">Price</label>
                                <input
                                    type="text"
                                    id="price_field"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description_field">Description</label>
                                <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="variety_field">Variety</label>
                                <select className="form-control" id="variety_field" value={variety} onChange={(e) => setVariety(e.target.value)}>
                                    {varieties.map(variety => (
                                        <option key={variety} value={variety}>{variety}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock_field">Stock</label>
                                <input
                                    type="number"
                                    id="stock_field"
                                    className="form-control"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="supplier_field">Supplier</label>
                                <select className="form-control" id="supplier_field" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group'>
                                <label>Images</label>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='images'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={onChange}
                                        multiple
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {oldImages && oldImages.map(img => (
                                    <img key={img.public_id} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                ))}
                                {imagesPreview.map(img => (
                                    <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                ))}
                            </div>
                            <button
                                id="login_button"
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading ? true : false}
                            >
                                UPDATE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditProduct;
