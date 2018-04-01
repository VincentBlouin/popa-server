const {Products} = require('../model')

module.exports = {
  list (req, res) {
    return Products.findAll({
      where: {
        type: {
          $ne: 'adminOnly'
        }
      },
      order: [
        ['nbInStock', 'DESC']
      ]
    }).then(function (products) {
      res.send(products)
    })
  }
}
