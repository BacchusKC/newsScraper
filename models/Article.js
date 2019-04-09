var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  link: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  category: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

ArticleSchema.plugin(uniqueValidator);

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
