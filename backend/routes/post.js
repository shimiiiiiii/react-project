const express = require('express');
const router = express.Router();
const { create, list, read, remove, update } = require('../controllers/post');
// const { requireSignin } = require('../controllers/auth');
router.post('/post', create);
// router.get('/posts', list);
// router.get('/post/:slug', read);
// router.delete('/post/:slug', requireSignin, remove);
// router.put('/post/:slug', requireSignin, update);
module.exports = router;