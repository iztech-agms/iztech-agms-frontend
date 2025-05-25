import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import LanguageIcon from '@mui/icons-material/Language';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleDeleteNotification = async (event, notificationId) => {
    event.stopPropagation();
    const res = await api.post('/notifications/delete/id/' + notificationId);
    if (res?.data?.code === "0") {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (event, notificationId) => {
    event.stopPropagation();

    const { ...notification } = notifications.find(notification => notification?.id === notificationId);
    notification.is_notification_read = true;
    const res = await api.post('/notifications/update', notification);
    if (res?.data?.code === "0") {
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.post('/notifications/get/user-id/' + currentUser?.id);
      setNotifications(response?.data?.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleLogoClick = () => {
    if (currentUser?.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

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
        <Box 
          display="flex" 
          alignItems="center" 
          onClick={handleLogoClick}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <img
            src="/assets/img/iyte_logo.png"
            alt="IYTE Logo"
            style={{ height: 32, marginRight: 10 }}
          />
          <Typography variant="h6" fontWeight="bold">
            GMS
          </Typography>
        </Box>

        {/* Right Side: User Information + Log Out */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notification Icon */}
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Badge badgeContent={notifications?.filter(notification => !notification?.is_notification_read).length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 300,
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {notifications?.length > 0 ? notifications?.map((notification) => (
              <MenuItem key={notification.id} sx={{ py: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {new Date(notification.created_at).toLocaleString('tr-TR')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMarkAsRead(e, notification.id)}
                    sx={{
                      mr: 0.5,
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: '#f44336',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            )) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                px: 2
              }}>
                <NotificationsIcon sx={{
                  fontSize: 48,
                  color: 'text.secondary',
                  opacity: 0.5,
                  mb: 1
                }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t("no_notifications")}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                  {t("new_notifications_will_appear_here")}
                </Typography>
              </Box>
            )}
          </Menu>

          {/* Language Selector */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={handleLanguageClick}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <LanguageIcon fontSize="small" />
                <Typography variant="body2">{i18n.language.toUpperCase()}</Typography>
              </Box>
            </IconButton>
            <Menu
              anchorEl={languageAnchorEl}
              open={Boolean(languageAnchorEl)}
              onClose={handleLanguageClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 120,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem onClick={() => handleLanguageChange('en')} selected={i18n.language === 'en'}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">🇺🇸</Typography>
                  <Typography variant="body2">English</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange('tr')} selected={i18n.language === 'tr'}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">🇹🇷</Typography>
                  <Typography variant="body2">Türkçe</Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Box>

          <Avatar sx={{ bgcolor: '#ccc', width: 40, height: 40, cursor: 'pointer' }}>
            {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
          </Avatar>
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {currentUser?.first_name} {currentUser?.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
              {t(currentUser?.role)}
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
