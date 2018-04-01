const models = require('../model')
const {
  Transactions,
  TransactionItems,
  Users,
  Products
} = models

const SUBSCRIBER_REBATE_CODE = 'subscriber'
const REBATE_RATIO = 0.1

module.exports = {
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
  addTransaction (req, res) {
    const userId = parseInt(req.params['ownerId'])
    let items = req.body
    let user
    let transaction
    return Users.findOne({
      where: {
        id: userId
      }
    }).then(function (_user) {
      user = _user
      return Products.findAll({
        where: {
          id: {
            $in: items.map(function (item) {
              return item.id
            })
          }
        }
      })
    }).then(function (products) {
      items = items.map(function (item) {
        item.unitPrice = products.filter(function (product) {
          return product.id === item.id
        })[0].unitPrice
        if (item.quantity < 0) {
          item.quantity = 0
        }
        item.totalPrice = item.unitPrice * item.quantity
        if (user.status === 'subscribed') {
          const rebate = (item.totalPrice * REBATE_RATIO).toFixed(2)
          item.totalPriceAfterRebate = (item.totalPrice - rebate).toFixed(2)
          item.rebates = [{
            amount: rebate,
            code: SUBSCRIBER_REBATE_CODE
          }]
        } else {
          item.totalPriceAfterRebate = item.totalPrice.toFixed(2)
        }
        item.ProductId = item.id
        item.id = null
        return item
      })
      const totalPrice = items.reduce(function (sum, item) {
        return sum + item.totalPriceAfterRebate
      }, 0)
      return Transactions.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
        where: {
          UserId: user.id
        }
      }).then(function (latestTransactions) {
        models.sequelize.transaction(function (t) {
          return Transactions.create({
            totalPrice: totalPrice.toFixed(2),
            balance: (latestTransactions[0].balance - totalPrice).toFixed(2)
          }, {
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
            res.send(transaction)
          })
        })
      })
    })
  }
}
