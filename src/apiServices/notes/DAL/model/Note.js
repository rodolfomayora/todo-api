const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  }
},{
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false
  }
});

module.exports = model('Note', noteSchema, 'notes');