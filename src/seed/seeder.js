const config = require('../config')
config.setEnvironment('development')
const Promise = require('bluebird')
const {
  sequelize,
  Users,
  Products,
  Transactions,
  TransactionItems
} = require('../model')

const users = require('./Users.json')
const products = require('./Products.json')
const transactions = require('./Transactions.json')
const transactionItems = require('./TransactionItems.json')

module.exports = {
  run: function () {
    return sequelize.sync({force: true})
      .then(() => {
        return Promise.all(
          users.map(user => {
            return Users.create(user)
          })
        )
      }).then(() => {
        return Promise.all(
          products.map(product => {
            return Products.create(product)
          })
        )
      }).then(() => {
        return Promise.all(
          transactions.map(transaction => {
            return Transactions.create(transaction)
          })
        )
      }).then(() => {
        return Promise.all(
          transactionItems.map(transactionItem => {
            return TransactionItems.create(transactionItem)
          })
        )
      }).catch(function (err) {
        console.log(err)
      })
  }
}
