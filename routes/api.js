const productController = require("../app/controller/productController");
const userController = require("../app/controller/userController");

function initRoutes(app) {
  //*********************************   API routes  **************************** *//
  app.get("/", productController().user);

  //  POST  http://localhost:8500/products/add-product
  app.post("/products/add-product", productController().create);

  //  GET  http://localhost:8500/products/:_id  // Get Single Product
  app.get("/products/:id", productController().find);

  //  PUT  http://localhost:8500/products/:_id
  app.put("/products/:id", productController().update);

  //  GET  http://localhost:8500/products   All List Products
  app.get("/products", productController().index);

  // delete   http://localhost:8500/products/:_id
  app.delete("/products/:id", productController().delete);

  // Search Product in API 
  app.get("/search/:key", productController().search);

  // add user
  app.post("/register", userController().createUser);
  // login user
  app.post("/login", userController().loginUser);
}
module.exports = initRoutes;
