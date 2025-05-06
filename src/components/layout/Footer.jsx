import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 2,
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} AGMS – IZTECH Graduation Management System
      </Typography>
    </Box>
  );
}
