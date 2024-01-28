const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Hall = require("../models/hall");

authRouter.post("/api/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ meg: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let user = new User({ name, email, password: hashedPassword });

    user = await user.save();
    res.json(user);
  } catch (e) {
    // console.log(e);
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exists" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "sarvottamsharma999");

    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.post("/tokenisValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "sarvottamsharma999");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data

authRouter.get("/api/getalluser" , async (req, res) => {
  try {
    const user = await User.find();
    res.json({
        user
    });
    
  } catch (e) {
    res.status(500).json({ error: e.message });
    
  }
   
});


// get user data by id

authRouter.post("/api/getuser", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);

    // Destructuring to include only desired fields
    const { _id, name, email, password, address, type } = user;

    res.json({ _id, name, email, password, address, type , likedHalls: user.likedHalls, favoriteHalls: user.favoriteHalls});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




// update user data
  
authRouter.put("/api/updateuser/:id" , async (req, res) => {

  try {
    const user = await User.findByIdAndUpdate(req.params.id , req.body , {new: true});
    res.json({
        user
    });
    
  }
  catch (e) {
    res.status(500).json({ error: e.message });
    
  }

}
);


// API endpoint to track which halls a user has liked
authRouter.post('/api/user/liked-halls', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by their ID and populate the likedHalls array
    const user = await User.findById(userId).populate('likedHalls');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const likedHalls = user.likedHalls;
    res.json({ ...likedHalls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

authRouter.post('/api/user/add-fav', async (req, res) => {
  try {
    const { hallId, userId } = req.body;

    // Update the user's favorite halls
   const user =  await User.findByIdAndUpdate(userId, { $addToSet: { favoriteHalls: hallId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json( user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

authRouter.post('/api/user/rem-fav', async (req, res) => {
  try {
    const { hallId, userId } = req.body;

    // Remove the hall from the user's favorites
  const user =   await User.findByIdAndUpdate(userId, { $pull: { favoriteHalls: hallId } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

    res.json(user);
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



authRouter.post('/api/user/get-favs', async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by their ID and retrieve the favoriteHalls array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favoriteHalls = user.favoriteHalls;
    const favoriteHallsData = await Hall.find({ _id: { $in: favoriteHalls } });

    res.json(  favoriteHallsData );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
     
});





module.exports = authRouter;
