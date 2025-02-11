const { signUp, signIn, signOut, updateUser, me } = require('../controllers/user');
const auth = require('../middleware/auth');

const router = require('express').Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/sign-out', signOut);
router.patch('/update-user/:userId',auth, updateUser);
router.get('/me',auth, me);
module.exports = router;
