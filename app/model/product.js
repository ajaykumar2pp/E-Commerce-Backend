require('dotenv').config()
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        userId:{ type: String, required: true  },
        company:{ type: String, required: true  }
       
    },
    { timestamps: true });
module.exports = mongoose.model('Products', productSchema);