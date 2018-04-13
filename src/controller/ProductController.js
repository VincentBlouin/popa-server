const {Products} = require('../model')

module.exports = {
  listAvailable (req, res) {
    return Products.findAll({
      where: {
        isAvailable: true,
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
  },
  list (req, res) {
    return Products.findAll().then(function (products) {
      res.send(products)
    })
  },
  getDetails (req, res) {
    const productId = parseInt(req.params['productId'])
    return Products.findOne({
      where: {
        id: productId
      }
    }).then(function (product) {
      res.send(product)
    })
  },
  createProduct (req, res) {
    const product = req.body
    return Products.create({
      name: product.name,
      format: product.format,
      description: product.description,
      unitPrice: product.unitPrice,
      nbInStock: product.nbInStock,
      isAvailable: product.isAvailable,
      type: 'open'
    }).then(function (product) {
      res.send(product)
    })
  },
  updateProduct (req, res) {
    const product = req.body
    return Products.update({
      name: product.name,
      format: product.format,
      description: product.description,
      unitPrice: product.unitPrice,
      nbInStock: product.nbInStock,
      isAvailable: product.isAvailable
    }, {
      where: {
        id: product.id
      }
    }).then(function (product) {
      res.send(product)
    })
  }
}
