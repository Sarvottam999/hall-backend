const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },

  email: {
    require: true,
    type: String,
    trim: true,
    validate: { 
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return value.match(re);
      },
      message: "Please enter a valid email",
    },
  },

    password: {
        require: true,
        type: String,
        trim: true,
        validate: {
            validator: (value) => {
       
              return value.length > 6;
            },
            message: "Please enter a valid email",
          },
    },

    address: {
        type: String,
        trim: true,
        default: "",
    },
    likedHalls: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
    }],

    favoriteHalls: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
    }],

    type: {
        type: String,
        default: "user",
    },

    // cart
});

const User = mongoose.model("User", userSchema);

module.exports = User;



