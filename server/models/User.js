const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, lowercase: true, unique: true, required: true },
  firstname: { type: String, lowercase: true, required: true },
  lastname: { type: String, lowercase: true, required: true }, 
  todos: [{ 
    dateCreated: { type: Date, default: Date.now }, 
    dateModified: { type: Date, default: Date.now },
    text: String,
    todoStatus: { type: Boolean, default: false}
  }],
  dateJoined: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now },
  userActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;