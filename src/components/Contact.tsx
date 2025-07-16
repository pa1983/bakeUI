import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

function Contact() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Paul Anderson
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Contact Information
            </Typography>

            <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">(123) 456-7890</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Link href="mailto:pa1983@gmail.com" variant="body1" color="inherit" underline="hover">
                        pa1983@gmail.com
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <LinkedInIcon sx={{ mr: 1 }} />
                    <Link href="https://www.linkedin.com/in/panderson83" target="_blank" rel="noopener" variant="body1" color="inherit" underline="hover">
                        linkedin.com/in/panderson83
                    </Link>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <GitHubIcon sx={{ mr: 1 }} />
                    <Link href="https://github.com/pa1983" target="_blank" rel="noopener" variant="body1" color="inherit" underline="hover">
                        github.com/pa1983
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default Contact;