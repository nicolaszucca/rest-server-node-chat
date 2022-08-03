const express = require('express');
const router = express.Router();

const { usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete } = require('../controllers/users.controllers')



router.get('/', usersGet)

router.post('/', usersPost)

router.put('/:id', usersPut)

router.patch('/', usersPatch)

router.delete('/', usersDelete)


module.exports = router;