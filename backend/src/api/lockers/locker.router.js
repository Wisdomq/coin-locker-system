const express = require('express');
const router = express.Router();

const lockers = [
  { id: 1, status: 'available' },
  { id: 2, status: 'occupied' }
];

router.get('/', (req, res) => res.json(lockers));

router.post('/:id/unlock', (req, res) => {
  const locker = lockers.find(x => x.id == req.params.id);
  if (!locker) return res.status(404).send('Locker not found');

  locker.status = 'available';
  res.json({ success: true, locker });
});

module.exports = router;
