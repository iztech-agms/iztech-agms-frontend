import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={3}
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side: Logo + Title */}
        <Box display="flex" alignItems="center">
          <img
            src="/assets/img/iyte_logo.png"
            alt="IYTE Logo"
            style={{ height: 32, marginRight: 10 }}
          />
          <Typography variant="h6" fontWeight="bold">
            AGMS
          </Typography>
        </Box>

        {/* Right Side: User Information + Log Out */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#ccc', width: 40, height: 40, cursor: 'pointer'  }}>
            {currentUser?.username?.charAt(0)}
          </Avatar>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2}}>
              {currentUser?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
              {currentUser?.role}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ 
              ml: 1,
              textTransform: 'none',
              fontWeight: 500,
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: '#333'
              }
            }}
            onClick={() => handleLogout()}
          >
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
