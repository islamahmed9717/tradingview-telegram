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
const YOUR_URL  = 'https://tradingview-telegram.onrender.com';
// ====================================

const PORT = process.env.PORT || 3000;

// ====================================
// KEEP-ALIVE PING (every 14 minutes)
// Prevents Render free plan from sleeping
// ====================================
setInterval(() => {
    axios.get(YOUR_URL)
        .then(() => console.log('✅ Keep-alive ping sent'))
        .catch(err => console.log('⚠️ Ping failed:', err.message));
}, 14 * 60 * 1000); // 14 minutes

// ====================================

app.get('/', (req, res) => {
    res.send('✅ Webhook running!');
});

app.post('/webhook', async (req, res) => {
    try {
        let message = typeof req.body === 'string'
            ? req.body
            : req.body.message || JSON.stringify(req.body);

        console.log('📨 Alert received:', message);

        // Add green/red emoji based on signal type
        let icon = message.includes('BUY') ? '🟢' : '🔴';
        let formatted = icon + ' ' + message;

        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            { chat_id: CHAT_ID, text: formatted }
        );

        console.log('✅ Sent to Telegram!');
        res.status(200).json({ success: true });

    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
