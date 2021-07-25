const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
   username: {
      type: String,
      unique: true,
      required: "Username is required to continue",
      trim: true
   },
   email: {
      type: String, 
      required: "Email is required to continue",
      unique: true,
      match: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/
   },
   thoughts: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Thought'
      }
   ],
   friends: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User'
      }
   ]
},
{
   toJSON: {
      virtuals: true,
      getters: true
   },
   id: false
});

UserSchema.virtual('friendCount').get(function() {
   return this.friends.length
});

const User = model('User', UserSchema);

module.exports = User;