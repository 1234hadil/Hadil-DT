const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// حفظ البيانات في memory مؤقتاً
global.responses = [];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/api/response', require('./routes/response'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/admin.html'));
});

app.listen(PORT, () => console.log(`🚀 Serveur: http://localhost:${PORT}`));