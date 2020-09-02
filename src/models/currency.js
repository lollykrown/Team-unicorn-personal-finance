const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currencySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    currency: { type: String, required: true}
});

module.exports = mongoose.model("Currency", currencySchema);