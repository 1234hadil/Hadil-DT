const express = require('express');
const router = express.Router();

router.get('/responses', (req, res) => {
  const total = global.responses.length;
  const accepted = global.responses.filter(r => r.accepted).length;
  res.json({ stats: { total, accepted, declined: total - accepted }, responses: global.responses.reverse() });
});

router.delete('/responses/:id', (req, res) => {
  global.responses = global.responses.filter(r => r._id !== req.params.id);
  res.json({ success: true });
});

router.delete('/responses', (req, res) => {
  global.responses = [];
  res.json({ success: true });
});

module.exports = router;