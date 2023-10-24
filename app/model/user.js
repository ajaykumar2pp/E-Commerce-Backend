const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        products:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],
        date:{ type:String, default:Date.now }
       
    },
    { timestamps: true });
module.exports = mongoose.model('User', productSchema);