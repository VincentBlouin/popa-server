const express = require('express')
const router = express.Router()
const AuthenticationController = require('../controller/AuthenticationController')
const AuthenticationControllerPolicy = require('../policy/AuthenticationControllerPolicy')

const UserController = require('../controller/UserController')

const SubscriberController = require('../controller/SubscriberController')
const TransactionController = require('../controller/TransactionController')

const ProductController = require('../controller/ProductController')

const isAuthenticated = require('../policy/isAuthenticated')
const isOwnerOrAdmin = require('../policy/isOwnerOrAdmin')
const isArdoiseUser = require('../policy/isArdoiseUser')
const isOwnerArdoiseUserOrAdmin = require('../policy/isOwnerArdoiseUserOrAdmin')
// const isAdmin = require('../policy/isAdmin')

router.post(
  '/register',
  AuthenticationControllerPolicy.register,
  AuthenticationController.register
)
router.post(
  '/login',
  AuthenticationController.login
)

router.post(
  '/login/ardoise',
  AuthenticationController.ardoiseLogin
)

router.post(
  '/reset-password',
  AuthenticationController.resetPassword
)

router.post(
  '/token-valid',
  AuthenticationController.isTokenValid
)

router.post(
  '/change-password',
  AuthenticationController.changePassword
)

router.post(
  '/email-exists',
  AuthenticationController.emailExists
)

router.post(
  '/user/:ownerId/locale',
  isOwnerOrAdmin,
  UserController.changeLocale
)

router.get(
  '/subscribers',
  isArdoiseUser,
  SubscriberController.list
)

router.get(
  '/product',
  isAuthenticated,
  ProductController.list
)

router.get(
  '/subscriber/:ownerId',
  isOwnerArdoiseUserOrAdmin,
  TransactionController.list
)

router.post(
  '/subscriber/:ownerId',
  isOwnerArdoiseUserOrAdmin,
  TransactionController.addTransaction
)

module.exports = router
