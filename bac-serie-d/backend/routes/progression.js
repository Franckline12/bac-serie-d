const router = require('express').Router();
const ctrl = require('../controllers/progressionController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, ctrl.dashboard);
router.get('/matieres', protect, ctrl.matieres);
router.get('/classement', protect, ctrl.classement);

module.exports = router;
