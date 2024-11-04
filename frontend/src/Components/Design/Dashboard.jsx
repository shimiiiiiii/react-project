// Dashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import OverviewCard from './OverviewCard';
import SalesChart from './SalesChart';
import ConversionRateCard from './ConversionRateCard';
import PremiumPlanCard from './PremiumPlanCard';
import ProductList from './ProductList';
import { Grid, Container } from '@mui/material';

function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <Container>
          <Grid container spacing={3} style={{ marginTop: '16px' }}>
            {/* Overview Cards */}
            <Grid item xs={12} md={3}>
              <OverviewCard title="New Net Income" value="$53,765" change={10.5} />
            </Grid>
            <Grid item xs={12} md={3}>
              <OverviewCard title="Average Sales" value
="$12,680" change={3.4} />
</Grid>
<Grid item xs={12} md={3}>
  <OverviewCard title="Total Orders" value="11,294" change={-0.5} />
</Grid>
<Grid item xs={12} md={3}>
  <OverviewCard title="Impressions" value="456K" change={-15.2} />
</Grid>

{/* Sales Chart */}
<Grid item xs={12} md={8}>
  <SalesChart />
</Grid>

{/* Conversion Rate Card */}
<Grid item xs={12} md={4}>
  <ConversionRateCard />
</Grid>

{/* Product List */}
<Grid item xs={12} md={8}>
  <ProductList />
</Grid>

{/* Premium Plan Card */}
<Grid item xs={12} md={4}>
  <PremiumPlanCard />
</Grid>
</Grid>
</Container>
</div>
</div>
);
}

export default Dashboard;
