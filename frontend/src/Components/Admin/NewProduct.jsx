import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Meta from '../Layout/Meta'
// import SideBar from './SideBar'
import { getToken } from '../../utils/helpers'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const NewProduct = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [variety, setVariety] = useState('')
    const [varieties, setVarieties] = useState([])
    const [stock, setStock] = useState(0)
    const [images, setImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [product, setProduct] = useState({})

    let navigate = useNavigate()

    useEffect(() => {
        // fetch suppliers
        const fetchVarieties = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/varieties`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                })
                setVarieties(data.varieties)
            } catch (error) {
                setError(error.response.data.message)
            }
        }

        fetchVarieties()
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.set('name', name)
        formData.set('price', price)
        formData.set('description', description)
        formData.set('variety', variety)
        formData.set('stock', stock)

        images.forEach(image => {
            formData.append('images', image)
        })

        newProduct(formData)
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([])
        setImages([])

        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    // const newProduct = async (formData) => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${getToken()}`
    //             }
    //         }

    //         const { data } = await axios.post(`http://localhost:4000/api/admin/product/new`, formData, config)
    //         setLoading(false)
    //         setSuccess(data.success)
    //         setProduct(data.product)
    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }
    const newProduct = async (formData) => {
        setLoading(true); 
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
    
            const response = await axios.post(`http://localhost:4000/api/admin/product/new`, formData, config);
            const { data } = response; // access data after successful
            setLoading(false);
            setSuccess(data.success);
            setProduct(data.product);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError(error.response ? error.response.data.message : error.message);
        }
    };
    

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            })
        }

        if (success) {
            toast.success('Product created successfully', {
                position: 'bottom-right'
            })
            navigate('/admin/products')
        }
    }, [error, success])

    return (
        <>
            <Meta title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <SideBar /> */}
                </div>

                <div className="col-12 col-md-10">
                    <>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

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
                                        type="number"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                {/* <div className="form-group">
                                    <label htmlFor="variety_field">Variety</label>
                                    <select className="form-control" id="variety_field" value={variety} onChange={(e) => setVariety(e.target.value)}>
                                        {varieties.map(variety => (
                                            <option key={variety} value={variety}>{variety}</option>
                                        ))}
                                    </select>
                                </div> */}

                                <div className="form-group">
                                    <label htmlFor="variety_field">Variety</label>
                                    <select className="form-control" id="variety_field" value={variety} onChange={(e) => setVariety(e.target.value)}>
                                        <option value="">Select Variety</option>
                                        {varieties.map(variety => (
                                            <option key={variety._id} value={variety._id}>{variety.name}</option>
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
                </div>
            </div>
        </>
    )
}

export default NewProduct
