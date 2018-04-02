const models = require('../model')
const {
  Transactions,
  TransactionItems,
  Users,
  Products
} = models

const SUBSCRIBER_REBATE_CODE = 'subscriber'
const REBATE_RATIO = 0.1

const TransactionController = {
  list (req, res) {
    const subscriberId = parseInt(req.params['ownerId'])
    return Transactions.findAll({
      where: {
        UserId: subscriberId
      }
    }).then(function (transactions) {
      res.send(transactions)
    })
  },
  subscriberTransaction (req, res) {
    let user
    const userId = parseInt(req.params['ownerId'])
    return Users.findOne({
      where: {
        id: userId
      }
    }).then(function (_user) {
      user = _user
      return Transactions.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
        where: {
          UserId: user.id
        }
      }).then(function (latestTransactions) {
        if (latestTransactions.length > 0) {
          return latestTransactions[0]
        }
      })
    }).then(function (latestTransaction) {
      return TransactionController._transaction(
        req.body, user, latestTransaction
      )
    }).then(function (transaction) {
      res.send(transaction)
    })
  },
  anonymousTransaction (req, res) {
    return TransactionController._transaction(
      req.body
    ).then(function (transaction) {
      res.send(transaction)
    })
  },
  _transaction (items, user, latestUserTransaction) {
    let transaction
    return Products.findAll({
      where: {
        id: {
          $in: items.map(function (item) {
            return item.id
          })
        }
      }
    }).then(function (products) {
      items = items.map(function (item) {
        item.unitPrice = products.filter(function (product) {
          return product.id === item.id
        })[0].unitPrice
        if (item.quantity < 0) {
          item.quantity = 0
        }
        item.totalPrice = item.unitPrice * item.quantity
        if (user && user.status === 'subscribed') {
          const rebate = parseFloat(item.totalPrice * REBATE_RATIO).toFixed(2)
          item.totalPriceAfterRebate = parseFloat(item.totalPrice - rebate).toFixed(2)
          item.rebates = [{
            amount: rebate,
            code: SUBSCRIBER_REBATE_CODE
          }]
        } else {
          item.totalPriceAfterRebate = parseFloat(item.totalPrice).toFixed(2)
        }
        item.ProductId = item.id
        item.id = null
        return item
      })
      const totalPrice = items.reduce(function (sum, item) {
        return sum + item.totalPriceAfterRebate
      }, 0)
      return models.sequelize.transaction(function (t) {
        const newTransaction = {
          totalPrice: parseFloat(totalPrice).toFixed(2)
        }
        if (user) {
          newTransaction.UserId = user.id
        }
        if (latestUserTransaction) {
          newTransaction.balance = parseFloat(
            latestUserTransaction.balance - totalPrice
          ).toFixed(2)
        }
        return Transactions.create(newTransaction, {
          transaction: t
        }).then(function (_transaction) {
          transaction = _transaction
          return Promise.all(items.map(function (item) {
            item.TransactionId = transaction.id
            return TransactionItems.create(
              item, {
                transaction: t
              }
            )
          }))
        }).then(function () {
          return transaction
        })
      })
    })
  }
}

module.exports = TransactionController
