// ProductList.jsx
import React from 'react';
import { Card, Typography, Grid, TextField, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function ProductList() {
  return (
    <Card style={{ padding: '16px' }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Product List</Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField variant="outlined" size="small" placeholder="Search product..." />
          <IconButton color="primary">
            <RefreshIcon />
          </IconButton>
        </div>
      </Grid>
      <div style={{ marginTop: '16px' }}>
        {/* Sample data, replace with real data */}
        <Grid container spacing={2}>
          <Grid item xs={6}>Rompi Berkancing</Grid>
          <Grid item xs={2}>$119.99</Grid>
          <Grid item xs={2}>Stock: 25</Grid>
          <Grid item xs={2}>Sold: 320</Grid>
        </Grid>
      </div>
    </Card>
  );
}

export default ProductList;
