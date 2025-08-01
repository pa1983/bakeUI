import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFound() {
    return (
        <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h1" component="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>
            <Button variant="contained" color="primary" href="/">
                Go to Homepage
            </Button>
        </Container>
    );
}

export default NotFound;
