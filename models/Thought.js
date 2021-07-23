const { Schema, model, Types } = require('mongoose');
//utils date format

const ReactionSchema = new Schema({
   reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
   },
   reactionBody: {
      type: String,
      required: true,
      maxLength: 280
   },
   username: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now,
      //get format
   }
});

const ThoughtSchema = new Schema({
   thoughtText: {
      type: String, 
      required: 'Some text required to continue',
      minLength: 1,
      maxLength: 280
   },
   createdAt: {
      type: Date,
      default: Date.now,
      //format date
   },
   username: {
      type: String,
      required: true
   },
   reactions: [ReactionSchema]
},
{
   toJSON: {
      virtuals: true,
      getters: true
   },
   id: false
});

//virtual reactionCount, length of reactions array
ThoughtSchema.virtual('reactionCount').get(function() {
   return this.reactions.length
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
