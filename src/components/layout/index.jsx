import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Top Menu */}
      <Header />

      {/* Main Content */}
      <Box flexGrow={1} p={0}>
        {children}
      </Box>

      {/* Bottom Menu */}
      <Footer />
    </Box>
  );
}
