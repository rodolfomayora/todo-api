const { Schema, model } = require('mongoose');

const modelName = 'Note';

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

const collection = 'notes';

module.exports = model(modelName, noteSchema, collection);