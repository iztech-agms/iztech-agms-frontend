// src/pages/auth/ResetPassword.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      // Show notification message
      setSnackbar({
        open: true,
        message: 'Passwords do not match!',
        severity: 'error'
      });
    } else {
      // Show notification message
      setSnackbar({
        open: true,
        message: 'Password reset successful',
        severity: 'success'
      });
      // Wait 0.5 seconds
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/login');
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleResetPassword();
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f3f4f6"
      >
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {t('reset_your_password')}
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            {t('enter_your_new_password_below')}
          </Typography>

          <TextField
            fullWidth
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            name="newPassword"
            value={passwords?.newPassword}
            onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })}
            onKeyPress={handleKeyPress}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your new password"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            name="confirmPassword"
            value={passwords?.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })}
            onKeyPress={handleKeyPress}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: 'black', ':hover': { bgcolor: '#333' } }}
            onClick={handleResetPassword}
          >
            {t('reset_password')}
          </Button>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
