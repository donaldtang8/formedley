const mongoose = require('mongoose');

const inputResponseSchema = new mongoose.Schema({
  inputText: {
    type: String,
    required: [true, 'Input text is required']
  },
  inputAnswer: {
    type: String,
  },
  selectedOptions: {
    type: [String]
  }
});

const responseSchema = new mongoose.Schema(
  {
    responses: {
      type: [inputResponseSchema],
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'Responses are required'
      }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    form: {
        type: mongoose.Schema.ObjectId,
        ref: 'Form'
    },
    viewed: {
      type: Boolean,
      default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEX
responseSchema.index({ createdAt: 1, user: 1 });

// QUERY MIDDLEWARE
/**
 * @function
 * @description Populate user details on response
 **/
responseSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    });
    next();
});

// INSTANCE/STATIC METHODS
responseSchema.methods.viewedResponse = function () {
  return this.viewed;
};

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
