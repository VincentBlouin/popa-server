const config = require('./config')
const nodemailer = require('nodemailer')
const isMock = config.getConfig().sendgrid === 'mock'
const Transport = require(
  isMock
    ? 'nodemailer-mock-transport'
    : 'nodemailer-sendgrid-transport'
)
const emailOptions = isMock ? {} : {
  auth: {
    api_user: config.getConfig().sendgrid.user,
    api_key: config.getConfig().sendgrid.password
  }
}
const transport = Transport(emailOptions)
const emailClient = nodemailer.createTransport(transport)
const sprintf = require('sprintf-js').sprintf
const supportTextFR = {
  text: "Pour plus d'information visitez la section support de notre site",
  link: 'www.mindstack.io'
}
const supportTextEN = {
  text: 'For more information visit the support section of our website',
  link: 'www.mindstack.io'
}
const EmailClient = {
  client: emailClient,
  transport: transport,
  formatDueDate: function (date, language) {
    date.locale(language === 'fr' ? 'fr' : 'en')
    const day = language === 'fr' ? date.format('DD MMMM') : date.format('MMMM DD')
    const at = language === 'fr' ? 'à' : 'at'
    return day + ' ' + at + ' ' + date.format('HH:mm')
  },
  buildFrom: function (fromEmail) {
    return 'Mindstack.io <' + fromEmail + '>'
  },
  addSupportText: function (emailDescription, language) {
    const content = language.toUpperCase() === 'FR' ? supportTextFR : supportTextEN
    emailDescription.html += '<br><br>' + content.text + ' ' + "<a href='" + content.link + "'>" + content.link + '</a>'
  },
  addEmailNumber: function (emailDescription, language, emailNumber) {
    emailDescription.html += '<br><br>' + "<span style='color:#A9A9A9;'>" + language.toUpperCase() + ' ' + emailNumber + '</span>'
  },
  buildEmailInLanguages: function (frenchContent, englishContent, dynamicData, emailNumber) {
    return {
      'FR': EmailClient._buildEmail(frenchContent, dynamicData, emailNumber, 'FR'),
      'EN': EmailClient._buildEmail(englishContent, dynamicData, emailNumber, 'EN')
    }
  },
  _buildEmail: function (emailText, dynamicData, emailNumber, locale) {
    const sprintfArguments = [emailText.content].concat(dynamicData)
    const emailContent = {
      from: EmailClient.buildFrom(emailText.from),
      subject: emailText.subject,
      html: sprintf.apply(
        null,
        sprintfArguments
      )
    }
    EmailClient.addSupportText(emailContent, locale)
    EmailClient.addEmailNumber(emailContent, locale, emailNumber)
    return emailContent
  }
}
module.exports = EmailClient
