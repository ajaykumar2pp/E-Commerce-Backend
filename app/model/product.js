require('dotenv').config()
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        userId: { type: String, required: true },
        company: { type: String, required: true },
        image: {
            type: String, required: true,
            get: function (image) {
                if (process.env.ON_RENDER === 'true') {
                    return image;
                }
                return `${image}`
            }
        }

    },
    { timestamps: true, toJSON: { getters: true }, id: false }
);
module.exports = mongoose.model('Product', productSchema);