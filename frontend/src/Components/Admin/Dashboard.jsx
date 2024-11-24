import  React, {useState} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import TableChartIcon from '@mui/icons-material/TableChart';
import CategoryIcon from '@mui/icons-material/Category';

import OrderStatus from './OrderStatus';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);


const pages = [
    {
        label: 'Charts',
        route: '/charts',
        icon: <SpaceDashboardIcon />,
    },
    {
        label: 'Orders',
        route: '/orders',
        icon: <MailIcon />,
    },
    {
        label: 'Products',
        route: '/admin/products',
        icon: <TableChartIcon />,
    },
    {
        label: 'Variety',
        route: '/admin/varieties',
        icon: <CategoryIcon />,
    },
    
]


export default function MiniDrawer({ children }) {

    const navigate = useNavigate();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [productOpen, setProductOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleProducts = () => {
        setProductOpen(!productOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ backgroundColor: '#000000' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[{ marginRight: 5 }, open && { display: 'none' }]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img
                        src="/piece logo.png"
                        alt="Logo"
                        style={{ height: '40px', marginRight: '1rem' }}
                    />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    {pages.map((page) => (
                        <React.Fragment key={page.label}>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={() => {
                                        if (page.children) {
                                            toggleProducts();
                                        } else {
                                            navigate(page.route);
                                        }
                                    }}
                                    sx={[
                                        { minHeight: 48, px: 2.5 },
                                        open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                    ]}
                                >
                                    <ListItemIcon
                                        sx={[
                                            { minWidth: 0, justifyContent: 'center' },
                                            open ? { mr: 3 } : { mr: 'auto' },
                                        ]}
                                    >
                                        {page.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={page.label}
                                        sx={[
                                            open ? { opacity: 1 } : { opacity: 0 },
                                        ]}
                                    />
                                    {page.children && open && (
                                        productOpen ? <ExpandLess /> : <ExpandMore />
                                    )}
                                </ListItemButton>
                            </ListItem>
                            {page.children && (
                                <Collapse in={productOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {page.children.map((child) => (
                                            <ListItemButton
                                                key={child.label}
                                                onClick={() => navigate(child.route)}
                                                sx={{ pl: open ? 4 : 2 }}
                                            >
                                                <ListItemIcon>{child.icon}</ListItemIcon>
                                                <ListItemText primary={child.label} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}
