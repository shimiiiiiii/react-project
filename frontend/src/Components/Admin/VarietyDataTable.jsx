import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import NewVariety from './NewVariety';
import EditVariety from './EditVariety';

const VarietyDataTable = () => {
    const [varieties, setVarieties] = useState([]);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [openNewVariety, setOpenNewVariety] = useState(false);
    const [openEditVariety, setOpenEditVariety] = useState(false);

    useEffect(() => {
        const fetchVarieties = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API}/varieties`, config);
                setVarieties(data.varieties);
            } catch (error) {
                toast.error('Failed to fetch varieties');
            }
        };
        fetchVarieties();
    }, []);

    const handleOpenNew = () => {
        setOpenNewVariety(true);
    };
    const handleCloseNew = () => {
        setOpenNewVariety(false);
    };
    const handleOpenEdit = (variety) => {
        console.log("Opening Edit Variety Modal with variety: ", variety);
        setSelectedVariety(variety);
        setOpenEditVariety(true);
    };
    const handleCloseEdit = () => {
        setSelectedVariety(null);
        setOpenEditVariety(false);
    };
    const handleDelete = async (id) => {
        const config = {
            headers: {
                        'Authorization': `Bearer ${getToken()}`
            },
        };
        try {
            await axios.delete(`${import.meta.env.VITE_API}/admin/variety/${id}`, config);
            setVarieties(varieties.filter((variety) => variety._id !== id));
            toast.success('Variety deleted successfully');
        } catch (error) {
            toast.error('Failed to delete variety');
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 400 },
        {
            field: 'images',
            headerName: 'Images',
            width: 300,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {params.row.images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Variety Image ${index + 1}`}
                            style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                marginRight: '5px',
                                marginBottom: '5px',
                                borderRadius: '4px',
                            }}
                        />
                    ))}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleOpenEdit(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const rows = varieties.map((variety) => ({
        id: variety._id,
        name: variety.name,
        description: variety.description,
        images: variety.images || [],
    }));

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <Typography variant="h4" gutterBottom>Varieties</Typography>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenNew}>
                Add New
            </Button>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} sx={{ mt: 2 }} />

            {/* New Variety Modal */}
            <Dialog open={openNewVariety} onClose={handleCloseNew} fullWidth maxWidth="sm">
                <DialogTitle>Add New Variety</DialogTitle>
                <DialogContent>
                    <NewVariety
                        onClose={handleCloseNew}
                        onAdd={(newVariety) => setVarieties([newVariety, ...varieties])}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNew} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Variety Modal */}
            <Dialog open={openEditVariety} onClose={handleCloseEdit} fullWidth maxWidth="sm">
                <DialogTitle>Edit Variety</DialogTitle>
                <DialogContent>
                    {selectedVariety ? (
                        <EditVariety
                            variety={selectedVariety} // Pass selected variety as a prop
                            onClose={handleCloseEdit}
                            onUpdate={(updatedVariety) => {
                                setVarieties(varieties.map((variety) => 
                                    variety._id === updatedVariety._id ? updatedVariety : variety
                                ));
                            }}
                        />
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default VarietyDataTable;
