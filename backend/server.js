require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// SECURITY: Change this to your actual frontend domain when you go live
// Example: origin: 'https://antonykent.com'
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5500' 
}));

app.use(express.json());

// --- YOUTUBE API ROUTE ---
// This fetches video details without exposing your GOOGLE_API_KEY
app.get('/api/youtube/video-info', async (req, res) => {
    try {
        const { videoId } = req.query;
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet,statistics',
                id: videoId,
                key: process.env.GOOGLE_API_KEY // Kept secret on server
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching YouTube data' });
    }
});

// --- TYPEFORM API ROUTE ---
// This fetches form responses using your Secret Personal Access Token
app.get('/api/typeform/responses', async (req, res) => {
    try {
        const { formId } = req.query;
        const response = await axios.get(`https://api.typeform.com/forms/${formId}/responses`, {
            headers: {
                'Authorization': `Bearer ${process.env.TYPEFORM_TOKEN}` // Kept secret on server
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Typeform data' });
    }
});

// --- GOOGLE OAUTH / SECRET KEY ROUTE (Example) ---
// If you are using a Client Secret for OAuth login
app.post('/api/google/auth', async (req, res) => {
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    // Your logic to exchange codes for tokens using the secret...
    res.json({ message: "Authentication logic goes here" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend is running on port ${PORT}`);
    console.log(`🔒 Secrets are loaded and protected.`);
});