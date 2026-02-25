const express = require('express');
const axios   = require('axios');
const app     = express();

app.use(express.json());
app.use(express.text());

// ====================================
// EDIT THESE WITH YOUR INFO:
// ====================================
const BOT_TOKEN = '8677935941:AAGa3jdhl9UokjddY94wSwREch1wq78ZQbE';
const CHAT_ID   = '7064725247';
// ====================================

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Webhook running!');
});

app.post('/webhook', async (req, res) => {
    try {
        let message = typeof req.body === 'string'
            ? req.body
            : req.body.message || JSON.stringify(req.body);

        let icon = message.includes('BUY') ? '🟢' : '🔴';
        let formatted = icon + ' ' + message;

        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            { chat_id: CHAT_ID, text: formatted }
        );

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
