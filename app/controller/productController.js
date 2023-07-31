const Product = require("../model/product");

function productController() {
  return {
    // ************************ data Get************************************//
    user(req, resp) {
      resp.render("home");
    },

    // ****************************  Product Create ******************************//

    async create(req, resp) {
      try {
        const { name, price, quantity, userId, company } = req.body;
        const createProduct = await Product.create({
          name,
          price,
          quantity,
          userId,
          company,
        });
        resp.status(201).json({ data: { product: createProduct } });
        createProduct.save();
      } catch (err) {
        resp.status(500).json({ error: "Failed to save product" });
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
        resp
          .status(200)
          .json({ data: { message: "product deleted successfully" } });
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
