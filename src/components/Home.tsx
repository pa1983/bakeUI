import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function Home() {
    return (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
                <HomeIcon sx={{ fontSize: 100, color: 'primary.main' }} />
            </Box>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Our Project!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                A brief overview of what we do.
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                This project is a demonstration of building modern web applications using React and Material-UI. We aim to create
                responsive, user-friendly interfaces with a clean and consistent design. Through this application, you can see
                examples of basic page layouts, component usage, and responsive design patterns. Our goal is to provide
                a solid foundation for developing scalable and maintainable front-end solutions.
            </Typography>
            <Button variant="contained" color="primary" href="/contact">
                Learn More
            </Button>

            <Typography variant="h4">
                Shortcuts
            </Typography>

                <ul>
                <li>CTRL+Enter to save changes</li>
                <li>CTRL+E to edit and cancel an edit</li>
                </ul>


        </Container>
    );
}

export default Home;
