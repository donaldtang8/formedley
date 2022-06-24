const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  inputType: {
    type: String,
    required: [true, 'Input type is required']
  },
  inputText: {
    type: String,
    required: [true, 'Input text is required']
  },
  inputAnswer: {
    type: String
  },
  selectOptions: {
    type: [String]
  },
  multiselect: {
    type: Boolean
  },
  required: {
    type: Boolean,
    default: false
  }
});

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    inputs: {
      type: [inputSchema],
      validate: {
        validator: function(arr) {
          console.log(arr);
          return arr.length > 0
        },
        message: 'Inputs are required'
      }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    responses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Response'
      }
    ],
    likes: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
    ],
    likeCount: {
        type: Number,
        default: 0,
    },
    views: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    viewCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// INDEX
formSchema.index({ createdAt: 1, user: 1 });

// VIRTUAL MIDDLEWARE
// /**
//  * @function
//  * @description Virtually populate all responses of form
//  **/
// formSchema.virtual('responses', {
//     ref: 'Response',
//     foreignField: 'form',
//     localField: '_id',
// });

// DOCUMENT MIDDLEWARE

// QUERY MIDDLEWARE
/**
 * @function
 * @description Populate user details on form
 **/
formSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'user',
      select: '-__v -passwordChangedAt',
    });
    next();
});

// INSTANCE/STATIC METHODS
formSchema.methods.likedForm = function (userId) {
  const found = this.likes.filter((like) => like._id.toString() === userId);
  return found.length > 0;
};

// INSTANCE/STATIC METHODS
formSchema.methods.viewedForm = function (userId) {
  const found = this.views.filter((user) => user._id.toString() === userId);
  return found.length > 0;
};

const Form = mongoose.model('Form', formSchema);
module.exports = Form;
