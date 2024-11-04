// OverviewCard.jsx
import React from 'react';
import { Card, Typography } from '@mui/material';

function OverviewCard({ title, value, change }) {
  return (
    <Card className="overview-card" style={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
      <Typography color={change >= 0 ? 'green' : 'red'}>
        {change >= 0 ? `+${change}%` : `${change}%`}
      </Typography>
    </Card>
  );
}

export default OverviewCard;
