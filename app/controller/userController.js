const User = require("../model/user");
const bcrypt = require('bcryptjs');

function userController() {
  return {
    async newUser(req, resp) {
      try {
        const { username, email, password } = req.body;

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let createUser = await User.create({
          username,
          email,
          password:hashedPassword
        });
        createUser.save();
        createUser = createUser.toObject();
        delete createUser.password;
        resp.status(201).json({ data: { user: createUser } });
        console.log(createUser)
      } catch (err) {
        resp.status(500).json({ error: "Failed User" });
      }
    },

    async loginUser(req, resp) {
      console.log(req.body)
      if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
          resp.send(user)
        }
        else {
          resp.send({ result: "Plz Check Passowrd or Email" })
        }
      } else {
        resp.send({ result: "Invalid User" })
      }


    },
  };
}
module.exports = userController;
