const { Thought, User } = require('../models');

const thoughtController = {
   //get all thoughts
   getAllThoughts(req, res) {
      Thought.find({})
         .then(thoughtData => res.json(thoughtData))
         .catch(err => res.status(400).json(err));
   },
   //get single thought by _id
   getThoughtById({ params }, res) {
      Thought.findOne( {_id: params.id })
         .then(thoughtData => {
            if (!thoughtData) {
               res.status(404).json({ message: 'No thought found with this id' });
               return;
            }
            res.json(thoughtData);
         })
         .catch(err => res.status(400).json(err));
   },
   //create thought
   createThought({ body }, res) {
      Thought.create(body)
         .then(thoughtData => {
            return User.findOneAndUpdate(
               { _id: body.userId },
               { $push: { thoughts: thoughtData._id }},
               { new: true }
            )
         })
         .then(res.json({ message: 'Thought added!' }))
         .catch(err => res.status(400).json(err));
   },
   //PUT, update thought by _id
   updateThought({ params, body }, res) {
      Thought.findOneAndUpdate(
         { _id: params.id },
         body,
         { new: true }
      )
      .then(thoughtData => {
         if (!thoughtData) {
            res.status(404).json({ message: 'No thought found with that id!' })
            return;
         }
         res.json(thoughtData);
      })
      .catch(err => res.status(400).json(err));
   },
   //delete (remove thought by _id)
   deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.id })
         .then(thoughtData => {
            if (!thoughtData) {
               res.status(404).json({ message: 'No thought found with that id' });
               return;
            }
            res.json(thoughtData);
         })
         .catch(err => res.status(400).json(err));
   },
   //POST create reaction in a single thoughts reactions array
   createReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true }
      )
      .then(thoughtData => {
         if (!thoughtData) {
            res.status(404).json({ message: 'No thought found with that id!' });
            return;
         }
         res.json(thoughtData);
      })
      .catch(err => res.status(400).json(err));
   },
   //DELETE to pull and remove reaction by reactionId
   deleteReaction({ params }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
        .then((thoughtData) => {
           if (!thoughtData) {
              res.status(404).json({ message: 'No thought found with that id' });
              return;
           }
           res.json(thoughtData);
        })
        .catch((err) => res.json(err));
   }
};

module.exports = thoughtController;