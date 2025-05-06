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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f3f4f6"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Enter your new password below
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
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, bgcolor: 'black', ':hover': { bgcolor: '#333' } }}
        >
          Reset Password
        </Button>
      </Paper>
    </Box>
  );
}
