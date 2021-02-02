const { func } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  token: { type: String, required: false },
});

userSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
userSchema.static.findByEmail = findByEmail;
async function findContactByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(id, { $set: updateParams }, { new: true });
}

async function findByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
  return this.findByIdAndUpdate({ id }, { token: newToken });
}

const contactModel = mongoose.model('Contact', userSchema);

module.exports = contactModel;
