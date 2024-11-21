const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema({
    clerkId: {
       type:String,
       required:true,
       unique: true,
    },
    email: {
     type:String,
     required:true,
     unique:true,
     lowercase:true,
     match:[/.+\..+/,'please fill a valid email address']
    },
    password:{
      type:true,
      required:true,
      minlength:6
    },
    photo: {
     type:String,
     unique:true,
    },
    username:{
     type:String,
     unique:true,
    },
    firstName: {
     type:String,
    },
    lastName:{
     type:String,
    },
    mobile_no:{
      type:String,
      required:true,
      unique:true,
      match:[/^\{10}$/,'Please fill a valid mobile no'],
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
      },
  });
  
  const DataModel = mongoose.model('User', UserSchema);

  module.exports = user;