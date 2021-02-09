const path = require('path');

const Avatar = require('avatar-builder');

exports.createAvatar = async (email) => {
  const avatar = Avatar.catBuilder(128);
  const userAvatar = await avatar.create(email);
  return userAvatar;
};
