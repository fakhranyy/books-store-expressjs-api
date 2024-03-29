const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require('joi-password-complexity')
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate jwt token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.SECRET_KEY,
    { expiresIn: "4d" }
  );
};

// User Model .. it'll create collection with "user" name and criteria like "UserSchema"
const User = mongoose.model("User", UserSchema);

// validate register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required()
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email().required(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).email(),
    username: Joi.string().trim().min(2).max(200),
    password: Joi.string().trim().min(6),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
};
