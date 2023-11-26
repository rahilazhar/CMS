const mongoose = require("mongoose")

const Userschema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: true
            
        },
        email:{
            type:String,
            required: true
        },
        password:{
            type:String,
            required:true
        }, 
        role:{
            type:Number,
            default: 0
        },

        // role: {
        //     type: String,
        //     enum: ['admin', 'user'],
        //     default: 'user'
        // },

        isUserApproved: {
            type: Boolean,
            default: false
        },

       


},{timestamps: true})

module.exports = mongoose.model('users' , Userschema )