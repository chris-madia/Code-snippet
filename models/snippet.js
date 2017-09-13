const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  title: {type: String, unique: true, required: true},
  date: {type: String},
  language: {type: String},
  body: {type: String, required: true},
  notes: {type: String},
  tags: [],
  userID: {type: Schema.Types.ObjectId}
});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
