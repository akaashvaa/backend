import mongoose , {Schema} from 'mongoose'

const userSchema = new Schema({
   username : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
    index :true
    },
   email : {
    type : String,
    required: true,
    unique : true,
    lowercase : true,
    trim : true
  },
   fullName : {
    type : String,
    required: true,
    trim : true,
    index :  true
  },
   avatar : {
    type : String,
    required: [true, "avatar is required"]
  },
   coverImage : {
    type : String 
  },
   password : { 
    type : String,
    required: [true, "password is required"]
  },
   refreshToken : {
    type : String,
    required: true
  },
  watchHistory : [
    {
      type : Schema.Types.ObjectId,
      ref : "Video"
    }
  ]
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)


