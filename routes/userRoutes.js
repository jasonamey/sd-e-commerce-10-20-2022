const express = require('express')
const { getAllUsers, 
  getSingleUser, 
  showCurrentUser, 
  updateUser, 
  updateUserPassword
} = require('../controllers/userController')
const { authorizePermissions, authenticateUser } = require('../middleware/authentication')
const router = express.Router()

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/:id').get(getSingleUser)

router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

module.exports = router