const { User } = require('../models');

const userController = {
  //get all users
  getAllUsers(req, res) {
     User.find({})
      .select('-__v')
      .then(userData => res.json(userData))
      .catch(err => {
         console.log(err);
         res.status(400).json(err);
      })
  }, 
  //get single user by _id, populate thought and friend data
  getUserById({ params }, res) {
     console.log(params);
     User.findOne({ _id: params.id })
       .select("-__v")
       .populate('friends')
       .populate('thoughts')
       .then((userData) => {
         if (!userData) {
           res.status(404).json({ message: "No user found with that id" });
           return;
         }
         res.json(userData);
       })
       .catch((err) => {
         console.log(err);
         res.status(400).json(err);
       });
  },
  //post new user
  createUser({ body }, res) {
     User.create(body)
         .then(userData => res.json(userData))
         .catch(err => res.status(400).json(err));
  },
  //put: update user by _id
  updateUser({ params, body }, res) {
     User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
         .then(userData => {
            if (!userData) {
               res.status(404).json({ message: 'No user found with this id' });
               return;
            }
            res.json(userData);
         })
         .catch(err => {
            console.log(err);
            res.status(400).json(err);
         })
  },
  //delete user by _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(userData => {
       if (!userData) {
          res.status(404).json({ message: 'No user found with this id '});
          return;
       }
       res.json(userData);
    })
    .catch(err => res.status(400).json(err));
  },
  //POST add firend to user friends list
  addFriend({ params }, res) {
     console.log(params);
      User.findOneAndUpdate({ _id: params.userId }, {$addToSet: {friends: params.friendId }}, { new: true } )
         .then(userData => res.json(userData))
         .catch(err => res.status(400).json(err));
  },
  //DELETE remove friend from user friend list
  deleteFriend({ params }, res) {
     User.findOneAndUpdate(
       { _id: params.userId },
       { $pull: { friends: params.friendId } },
       { new: true }
     )
       .then((userData) => res.json(userData))
       .catch((err) => res.status(400).json(err));
  }

};

module.exports = userController;