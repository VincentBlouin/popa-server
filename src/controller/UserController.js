const {Users} = require('../model')

module.exports = {
  changeLocale (req, res) {
    const userId = parseInt(req.params['ownerId'])
    const locale = req.body.locale
    if (!userId || !locale) {
      return res.sendStatus(400)
    }
    Users.findOne({
      where: {
        id: userId
      }
    }).then(function (user) {
      user.locale = locale
      return user.save()
    }).then(function () {
      res.sendStatus(200)
    })
  },
  clients (req, res) {
    return Users.findAll({
      where: {
        status: {
          $in: [
            null,
            'subscribed'
          ]
        }
      },
      attributes: ['id', 'firstName', 'lastName', 'status', 'balance', 'createdAt']
    }).then(function (subscribers) {
      res.send(subscribers)
    })
  },
  getClientDetails (req, res) {
    const clientId = parseInt(req.params['clientId'])
    return Users.findOne({
      where: {
        id: clientId
      },
      attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'balance', 'ardoiseIdentifier']
    }).then(function (client) {
      res.send(client)
    })
  },
  createClient (req, res) {
    const client = req.body
    client.status = 'subscribed'
    return Users.create({
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      ardoiseIdentifier: client.ardoiseIdentifier,
      status: client.status
    }).then(function (client) {
      res.send(client)
    })
  },
  updateClient (req, res) {
    const client = req.body
    return Users.update({
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      ardoiseIdentifier: client.ardoiseIdentifier
    }, {
      where: {
        id: client.id
      }
    }).then(function (client) {
      res.send(client)
    })
  }
}
