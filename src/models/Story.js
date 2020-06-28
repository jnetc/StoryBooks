const { Schema, model } = require('mongoose')

const story = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Story', story)