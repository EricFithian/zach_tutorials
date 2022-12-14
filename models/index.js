require('../config/db.connection')

module.exports = {
    Tutorial: require('./Tutorial'),
    Review: require('./Review'),
    User: require('./User')
}