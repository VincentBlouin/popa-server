const {Users} = require('../model')

module.exports = {
  list (req, res) {
    return Users.findAll({
      where: {
        status: null
      },
      attributes: ['id', 'firstName', 'lastName']
    }).then(function (subscribers) {
      res.send(subscribers)
    })
  }
}
