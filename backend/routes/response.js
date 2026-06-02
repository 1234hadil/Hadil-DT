const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { accepted, respondentName, dateChosen, timeChosen, foodChosen } = req.body;
  const entry = {
    _id: Date.now().toString(),
    accepted,
    respondentName: respondentName || 'Anonyme',
    dateChosen: accepted ? dateChosen : null,
    timeChosen: accepted ? timeChosen : null,
    foodChosen: accepted ? foodChosen : null,
    createdAt: new Date()
  };
  global.responses.push(entry);
  res.status(201).json({ success: true, data: entry });
});

module.exports = router;