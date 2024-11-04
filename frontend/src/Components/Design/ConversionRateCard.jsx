// ConversionRateCard.jsx
import React from 'react';
import { Card, Typography, Grid } from '@mui/material';

function ConversionRateCard() {
  return (
    <Card style={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="h6">Conversion Rate</Typography>
      <Typography variant="h4" style={{ color: 'green' }}>4.55%</Typography>
      <Typography color="green">+0.5%</Typography>

      <Grid container spacing={1} style={{ marginTop: '8px' }}>
        <Grid item xs={6}>
          <Typography variant="body2">Product views</Typography>
          <Typography>6,545</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Add to cart</Typography>
          <Typography>3,491</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Checkout initiated</Typography>
          <Typography>1,746</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">Completed purchases</Typography>
          <Typography>1,200</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ConversionRateCard;
