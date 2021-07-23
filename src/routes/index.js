const express = require('express')
const router = express.Router()
const AuthenticationController = require('../controller/AuthenticationController')
const AuthenticationControllerPolicy = require('../policy/AuthenticationControllerPolicy')

const UserController = require('../controller/UserController')

const TransactionController = require('../controller/TransactionController')

const ProductController = require('../controller/ProductController')

const isAuthenticated = require('../policy/isAuthenticated')
const isOwnerOrAdmin = require('../policy/isOwnerOrAdmin')
const isArdoiseUser = require('../policy/isArdoiseUser')
const isOwnerArdoiseUserOrAdmin = require('../policy/isOwnerArdoiseUserOrAdmin')
const isAdmin = require('../policy/isAdmin')

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
    '/clients',
    isAdmin,
    UserController.clients
)

router.post(
    '/clients',
    isAdmin,
    UserController.createClient
)

router.put(
    '/clients',
    isAdmin,
    UserController.updateClient
)

router.get(
    '/clients/:clientId',
    isAdmin,
    UserController.getClientDetails
)

router.get(
    '/available-product',
    isAuthenticated,
    ProductController.listAvailable
)

router.get(
    '/product',
    isAdmin,
    ProductController.list
)

router.put(
    '/product',
    isAdmin,
    ProductController.updateProduct
)

router.put(
    '/product/availability',
    isAdmin,
    ProductController.updateProductAvailability
)

router.put(
    '/product/price',
    isAdmin,
    ProductController.updateProductPrice
)

router.post(
    '/product',
    isAdmin,
    ProductController.createProduct
)

router.post(
    '/product/image',
    isAdmin,
    ProductController.uploadImage
)

router.get(
    '/product/image/:uuid',
    ProductController.getImage
)

router.get(
    '/product/:productId',
    isAuthenticated,
    ProductController.getDetails
)

router.get(
    '/:ownerId/transaction',
    isOwnerArdoiseUserOrAdmin,
    TransactionController.list
)

router.post(
    '/:ownerId/transaction',
    isOwnerArdoiseUserOrAdmin,
    TransactionController.subscriberTransaction
)

router.get(
    '/:ownerId/transaction/:transactionId',
    isOwnerArdoiseUserOrAdmin,
    TransactionController.transactionDetails
)
router.post(
    '/transaction',
    isArdoiseUser,
    TransactionController.anonymousTransaction
)

router.get(
    '/transactions/details',
    isAdmin,
    TransactionController.listAllDetails
)

router.post(
    '/transaction/fund',
    isAdmin,
    TransactionController.addFund
)

router.post(
    '/transaction/penalty',
    isAdmin,
    TransactionController.addPenaltyFee
)

module.exports = router
