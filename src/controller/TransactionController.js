const {
  Transactions,
  Users,
  Products
} = require('../model')

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
    const items = req.body
    return Users.findOne({
      where: {
        id: userId
      }
    }).then(function (user) {
      return Products.findAll({
        where: {
          id: {
            $in: items.map(function (item) {
              return item.id
            })
          }
        }
      })
    })
  }
}
