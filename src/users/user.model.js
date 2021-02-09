const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarURL: String,
  token: { type: String, required: false },
});

userSchema.statics.findByEmail = findByEmail;
userSchema.statics.updateToken = updateToken;

async function findByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
