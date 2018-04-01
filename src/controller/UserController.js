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
  }
}
