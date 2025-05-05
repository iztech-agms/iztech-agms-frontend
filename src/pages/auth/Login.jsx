// src/pages/auth/Login.jsx

import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { keyframes } from '@mui/system';

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
  const [forgotOpen, setForgotOpen] = useState(false);

  return (
    <>
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
            Log In to AGMS
          </Typography>

          <TextField
            fullWidth
            label="Email"
            placeholder="Enter your @iyte.edu.tr email"
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
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            placeholder="Enter your password"
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
          >
            Log in
          </Button>

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
              Forgot Password?
            </Link>
          </Typography>
        </Paper>
      </Box>

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
            Forgot Password
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
            Enter your email address and we'll send you a link to reset your password.
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
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
