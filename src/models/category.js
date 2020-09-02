const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    categoryName: { type: String, lowercase: true, required: true}
});

module.exports = mongoose.model("Category", categorySchema);