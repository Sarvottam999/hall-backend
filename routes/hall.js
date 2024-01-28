const express = require("express");
const Hall = require("../models/hall");
const User = require("../models/user");

const hallRouter = express.Router();



// Create a new hall
hallRouter.post('/api/halls', async (req, res) => {
    try {
      const {
        name,
        location,
        capacity,
        reviews,
        photos,
        about,
        pricePerPlate,
      } = req.body;
  
      const newHall = new Hall({
        name,
        location,
        capacity,
        reviews,
        photos,
        about,
        pricePerPlate,
      });
  
      await newHall.save();
      res.status(201).json(newHall);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Retrieve a list of all available halls
  hallRouter.get('/api/halls', async (req, res) => {
    try {
      const halls = await Hall.find();
      res.json(halls);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Retrieve information about a specific hall
  hallRouter.post('/api/getHallsById', async (req, res) => {
    const { _id } = req.body;
    console.log(req.body);
    try {
      const hall = await Hall.findById( _id);
      if (!hall) {
        return res.status(404).json({ error: 'Hall not found' });
      }
      res.json(hall);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // delete all halls
  hallRouter.delete('/api/halls', async (req, res) => {
    try {
      await Hall.deleteMany();
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Retrieve halls by name, location, or city
hallRouter.post('/api/halls/search', async (req, res) => {
  const {searchParam} = req.body;
console.log(req.body);
  try {
    // const searchTerms = ["rahul Hall"];
    // if "searchParam" is  undefined or null or empty string
    if (!searchParam) {
      return res.status(400).json({ error: 'Invalid search parameter' });
    }
      

    const halls = await Hall.find({
      $or: [
        { name: { $regex: new RegExp(searchParam, 'i') } },
        { location: { $regex: new RegExp(searchParam, 'i') } },
      ],
    });


    res.status(200).json(halls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error  });
  }
});


// API endpoint to like a hall
hallRouter.post('/api/like-hall', async (req, res) => {
  try {
    const { hallId, userId } = req.body;
    console.log(hallId, userId);

    // Update the hall's likes
    const h = await Hall.findByIdAndUpdate(hallId, { $addToSet: { likes: userId } }) ;
    // const h = await Hall.findById( hallId);

    if (!h) {
      return res.status(404).json({ error: 'Hall not found' });
    }
    // Update the user's liked halls
     const l=  await User.findByIdAndUpdate(userId, { $addToSet: { likedHalls: hallId } });

    //  console.log(l);
    if (!l) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Hall liked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to retrieve the total number of likes for a hall
hallRouter.post('/api/hall/likes', async (req, res) => {
  try {
    const { hallId } = req.body;
    
    // Find the hall by its ID and retrieve the number of likes
    const hall = await Hall.findById(hallId);
    
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    const totalLikes = hall.likes.length;
    res.json({ totalLikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






// // API to check hall availability on a particular date
// hallRouter.post('/api/checkAvailability', async (req, res) => {
//   try {
//     const { hallName, date } = req.body;

//     // Check if the hall is available on the given date
//     const isAvailable = await Hall.findOne({
//       name: hallName,
//       bookings: { $not: { $elemMatch: { date } } },
//     });

//     if (isAvailable) {
//       res.json({ message: 'Hall is available on the specified date.' });
//     } else {
//       res.json({ message: 'Hall is not available on the specified date.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
  
// get hall by place

  module.exports = hallRouter;