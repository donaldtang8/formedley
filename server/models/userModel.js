const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: [15, 'Please enter your first name under 15 characters long.'],
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      maxlength: [15, 'Please enter your last name under 15 characters long.'],
      required: [true, 'Last name is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    pass: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    passConfirm: {
      type: String,
      required: [true, 'Please provide a password'],
      validate: {
        validator: function (el) {
          return el === this.pass;
        },
        message: 'Passwords do not match',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role is either: user or creator',
      },
      default: 'user',
    },
    passChangedAt: Date,
    passResetToken: String,
    passResetExpires: Date
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* INDEX */
userSchema.index({ username: 1 });

/**
 * @function
 * @description Virtually populate this user with forms
 **/
userSchema.virtual('forms', {
  ref: 'Form',
  foreignField: 'user',
  localField: '_id',
});

/* DOCUMENT MIDDLEWARE */
/**
 * @function
 * @description Automatically hash passwords if password is being created or modified
 * @this Current document being created or modified
 **/
userSchema.pre('save', async function (next) {
  // only run this function if password was modified
  if (!this.isModified('pass')) return next();
  // encrypt this password with a "cost" - salt of 12
  this.pass = await bcrypt.hash(this.pass, 12);
  // no need to persist passwordConfirm to database
  this.passConfirm = undefined;
  next();
});

/**
 * @function
 * @description Set passwordChangedAt time if password is being modified
 * @this Current document being created or modified
 **/
userSchema.pre('save', function (next) {
  // only run this function if password was modified
  if (!this.isModified('pass') || this.isNew) return next();
  // update passwordChangedAt
  this.passChangedAt = Date.now() - 1000;
  next();
});

/* INSTANCE/STATIC METHODS */
/**
 * @function correctPassword
 * @description Checks if candidatePassword is correct
 * @param candidatePassword - Password submitted
 * @param userPassword - Password of user
 * @return True if password correct, false otherwise
 **/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * @function changedPasswordAfter
 * @description Check if token was created before new password change
 * @param JWTTimestamp Timestamp of when JWT was created (milliseconds)
 * @return True if password changed after token issued, false otherwise
 **/
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  let changedTimestamp;
  if (this.passChangedAt) {
    // convert date object to time in milliseconds
    changedTimestamp = parseInt(this.passChangedAt.getTime() / 1000, 10);
  }
  // if password was changed after token expiration, return true
  return JWTTimestamp < changedTimestamp;
};

/**
 * @function createPasswordResetToken
 * @description Create a password reset token
 * @return Reset Token
 **/
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // save the encrypted version of the reset token in the database
  this.passResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // set password reset token expires time (in milliseconds)
  this.passResetExpires = Date.now() + 60 * 1000 * 10; // add 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
