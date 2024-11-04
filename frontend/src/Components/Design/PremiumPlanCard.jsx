// PremiumPlanCard.jsx
import React from 'react';
import { Card, Button, Typography } from '@mui/material';

function PremiumPlanCard() {
  return (
    <Card style={{ padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
      <Typography variant="h6">Upgrade</Typography>
      <Typography variant="h4">Premium Plan</Typography>
      <Typography variant="body2" style={{ marginTop: '8px' }}>
        Supercharge your sales management and unlock your full potential for extraordinary success.
      </Typography>
      <Button variant="contained" color="primary" style={{ marginTop: '16px' }}>Upgrade</Button>
      <Typography variant="body2" style={{ marginTop: '16px' }}>Performance: 79%</Typography>
      <Typography variant="body2">Tools: 30+</Typography>
    </Card>
  );
}

export default PremiumPlanCard;
