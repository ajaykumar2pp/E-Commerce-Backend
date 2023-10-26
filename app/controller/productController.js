require('dotenv').config()
const multer = require("multer")
const path = require("path")
const fs = require('fs')
const Product = require("../model/product");
const User = require('../model/user')


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    // 3746674586-836534453.png
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 10 },
}).single('image'); // 10mb

function productController() {
  return {
    // ************************ data Get************************************//
    user(req, resp) {
      resp.render("home");
    },

    // ****************************  Product Create ******************************//

    async create(req, resp) {

      try {
        await handleMultipartData(req, resp, async (err) => {
          if (err) {
            console.error(err);
            return resp.status(500).json({ error: 'Internal server error' });
          }

          const { name, price, quantity, company, userId } = req.body;
          console.log(req.body)

          if (!name || !price || !quantity || !company || !userId) {
            // If any required field is missing in the request, delete the uploaded image
            if (req.file) {
              fs.unlinkSync(req.file.path);
            }
            return resp.status(400).json({ error: 'All required fields are mandatory' });
          }

          const filePath = req.file.path;
          const imageURL = `http://${req.headers.host}/${filePath.replace(/\\/g, '/')}`;
          console.log(req.file)
          console.log(filePath)

          const createProduct = await Product.create({
            name,
            price,
            quantity,
            userId,
            company,
            image: imageURL,
          });
          // Find user by id
          const user = await User.findById(userId);

          // If the user is found, add the product reference to the user
          if (user) {
            user.products.push(createProduct);
            await user.save();
          }

          console.log(createProduct)
          resp.status(201).json({ data: { product: createProduct } })
        })
      } catch (err) {
        console.error(err);
        resp.status(500).json({ error: 'Failed to save product' });
      }



    },

    // ********************************  Find List All Product *******************************//
    async index(req, resp) {
      try {
        const productList = await Product.find()
          .select("-updatedAt -createdAt -__v")
          .sort({ _id: -1 });
        if (productList.length > 0) {
          resp.json({ data: { product: productList } });
        } else {
          resp.json({ data: { product: "No products Found" } });
        }
      } catch (err) {
        resp.status(500).json({ error: "Failed to fetch product" });
      }
    },

    //******************************** Product Update by Id  **************************** */
    async update(req, resp) {
      try {
        const eComId = req.params.id;
        const { name, price, quantity, company } = req.body;
        const updateProduct = await Product.findOneAndUpdate(
          { _id: eComId },
          {
            name,
            price,
            quantity,
            company,
          },
          { new: true }
        )
          .select("-updatedAt -createdAt -__v")
          .sort({ _id: -1 });
        if (!updateProduct) {
          return resp.status(404).json({ error: "Product not found" });
        }
        console.log(updateProduct);
        resp.status(200).json({
          data: {
            product: updateProduct,
            message: "Product Update sucessfully",
          },
        });
      } catch (err) {
        resp.status(500).json({ error: "Failed to update product" });
      }
    },
    // ********************************  Delete products by Id  ******************************//
    async delete(req, resp) {
      try {
        const eComId = req.params.id;
        const deleteProduct = await Product.findOneAndRemove({ _id: eComId });
        if (!deleteProduct) {
          return resp.status(404).json({ error: "Product not found" });
        }

        const imageUrl = deleteProduct._doc.image;
        // Extract the path from the URL 
        const imagePath = imageUrl.replace("http://localhost:8500/", ''); 
        console.log(imagePath)

        fs.unlink(imagePath, (err) => {
          if (err) {
            // console.error(err);
            return resp.status(500).json({ error: "Image Not Deleted" });
          }

          return resp.status(200).json({ data: { message: "Product deleted successfully" } });
        });
      } catch {
        resp.status(500).json({ error: "Failed to delete product" });
      }
    },

    //**********************************  Find One Product  ******************************** */
    async find(req, resp) {
      try {
        const eComId = req.params.id;
        const findOneProduct = await Product.findOne({ _id: eComId }).select(
          "-updatedAt -createdAt -_v"
        );
        if (!findOneProduct) {
          return resp.status(404).json({ error: "Product not found" });
        }
        resp.json(findOneProduct);
      } catch (err) {
        resp.status(500).json({ error: "Failed to fetch product" });
      }
    },

    //**********************************  Find One Product  ******************************** */
    async search(req, resp) {
      try {
        let productId = req.params.key;
        let searchProduct = await Product.find({
          "$or": [
            { name: { $regex: productId } },
            { company: { $regex: productId } },
          ],
        }).select("-updatedAt -createdAt -_v");
        if (searchProduct.length === 0) {
          return resp.status(404).json({ error: "Product not found" });
        }
        resp.json(searchProduct);
      } catch (err) {
        resp.status(500).json({ error: "Failed to search product" });
      }
    },
  };
}
module.exports = productController;
