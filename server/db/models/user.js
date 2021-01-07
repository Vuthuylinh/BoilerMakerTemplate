const Sequelize = require('sequelize');
const db = require('../database')

const User = db.define('user',{
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Virtual columns - Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get(){
      return ()=>{
        this.getDataValue('password')
      }
    }
  }
})

module.exports = User
