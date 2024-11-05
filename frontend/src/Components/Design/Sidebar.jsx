// Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
// Add other icons as necessary

function Sidebar() {
  return (
    <div className="sidebar">
      <List>
        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        {/* Add more items as needed */}
      </List>
    </div>
  );
}

export default Sidebar;
