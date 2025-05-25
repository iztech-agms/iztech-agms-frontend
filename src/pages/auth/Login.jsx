// src/pages/auth/Login.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LanguageIcon from '@mui/icons-material/Language';
import { keyframes } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { loadingStart, loadingEnd, loginStart, loginSuccess, loginFailure, setUser, setAccessToken } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/api';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Login() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useSelector(state => state.user)
  useEffect(() => {
    if (user?.access_token) {
      return navigate('/dashboard')
    }
  }, [])

  const handleLogin = async () => {
    const { ...userCredentials } = loginCredentials;
    try {
      dispatch(loginStart());

      const res = await api.post('/auth/login', userCredentials)
      console.log(res?.data)
      if (res?.data?.status?.code !== "0") {
        setSnackbar({
          open: true,
          message: res?.data?.message,
          severity: 'error'
        })
      } else {
        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        })
        console.log(res?.data?.user)
        dispatch(setUser(res?.data?.user))
        dispatch(setAccessToken(res?.data?.token))

        // Wait 0.5 seconds
        await new Promise(resolve => setTimeout(resolve, 500));
        if (res?.data?.user?.role?.toLowerCase() === 'student') {
          navigate('/dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }

    } catch (error) {
      dispatch(loginFailure());
      console.error('Login error:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred during login. Please try again later.',
        severity: 'error'
      })
    } finally {
      dispatch(loadingEnd());
    }
  };

  const handleResetClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Show notification message
    setSnackbar({
      open: true,
      message: 'Verification code sent to your email',
      severity: 'success'
    });
    setIsVerificationCodeSent(!isVerificationCodeSent);
  }

  const handleApplyClick = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (verificationCode === '123456') {
      // Show notification message
      setSnackbar({
        open: true,
        message: 'verification code is correct',
        severity: 'success'
      });
      // Wait 0.5 seconds
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/reset-password');
    } else {
      // Show notification message
      setSnackbar({
        open: true,
        message: 'Invalid verification code',
        severity: 'error'
      });
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageClose();
  };

  return (
    <>
      {/* Language Selector */}
      <IconButton
        onClick={handleLanguageClick}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={() => changeLanguage('tr')}>Türkçe</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
      </Menu>

      {/* Login Form */}
      <Box
        display="flex "
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: 400,
            borderRadius: 2,
            animation: `${fadeIn} 0.5s ease-out`,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box textAlign="center" mb={2}>
            <img
              src="/assets/img/iyte_logo.png"
              alt="GMS Logo"
              style={{ display: 'block', margin: '0 auto 10px', width: 180, height: 180 }}
            />
          </Box>

          <Typography
            variant="h5"
            align="center"
            fontWeight="bold"
            mb={4}
            sx={{
              background: 'linear-gradient(45deg, #000000 30%, #434343 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('log_in_to_gms')}
          </Typography>

          <TextField
            fullWidth
            label={t('student_number')}
            placeholder={t('enter_your_student_number')}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'black',
                },
              },
            }}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
            onKeyPress={handleKeyPress}
          />
          <TextField
            fullWidth
            label={t('password')}
            type="password"
            placeholder={t('enter_your_password')}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'black',
                },
              },
            }}
            onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
            onKeyPress={handleKeyPress}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(45deg, #000000 30%, #434343 90%)',
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .2)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={handleLogin}
          >
            {t('sign_in')}
          </Button>

          {/*
          <Typography align="center" mt={2}>
            <Link
              component="button"
              onClick={() => setForgotOpen(true)}
              underline="hover"
              color="textSecondary"
              fontSize={14}
              sx={{
                '&:hover': {
                  color: 'black',
                },
                transition: 'color 0.3s ease',
              }}
            >
              {t('forgot_password')}
            </Link>
          </Typography>
          */}
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Forgot Password Modal */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {t('forgot_password')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setForgotOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
              '&:hover': {
                color: 'black',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography fontSize={14} mb={2} color="text.secondary">
            {t('enter_email_address_description')}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            placeholder="Enter your @iyte.edu.tr email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          {isVerificationCodeSent && (
            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              // Sadece sayı kabul et ve 6 basamak kabul et
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) {
                  setVerificationCode(e.target.value);
                }
              }}
              inputProps={{ maxLength: 6 }}
              margin="dense"
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(45deg, #000000 30%, #434343 90%)',
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .2)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={isVerificationCodeSent ? handleApplyClick : handleResetClick}
          >
            {isVerificationCodeSent ? t('apply') : t('reset_your_password')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
