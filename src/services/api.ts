// Read values from Vite's environment variables
const API_URL = import.meta.env.VITE_API_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;

// Validate that the variables were loaded correctly
if (!API_URL || !CLIENT_ID || !LOGOUT_URL || !COGNITO_DOMAIN) {
    throw new Error("Missing environment variables. Make sure .env.local is set up correctly.");
}

export default { API_URL, CLIENT_ID, LOGOUT_URL, COGNITO_DOMAIN };