const User = require("../model/user");

function userController() {
  return {
    async newUser(req, resp) {
      try {
        const { username, email, password } = req.body;
        let createUser = await User.create({
          username,
          email,
          password,
        });
        createUser.save();
        createUser = createUser.toObject();
        delete createUser.password;
        resp.status(201).json({ data: { user: createUser } });
      } catch (err) {
        resp.status(500).json({ error: "Failed User" });
      }
    },

    async loginUser(req,resp){
      console.log(req.body)
      if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
          resp.send(user)
        }
        else{
          resp.send({result:"Plz Check Passowrd or Email"})
        }
      }else{
        resp.send({result:"Invalid User"})
      }
    
   
    },
  };
}
module.exports = userController;
