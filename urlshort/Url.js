const mongoose=require('mongoose');

const UrlSchema=new mongoose.Schema({
    urlId:{
        type:String,
        required:true,
    },
    ogUrl:{
        type:String,
        required:true,
    },
    shortURL:{
        type:String,
        required:true,
    },
    clicks:{
        type:Number,
        required:true,
        default:0,
    },
    date:{
        type:String,
        default:Date.now,
    },
});

module.exports=mongoose.model("Url",UrlSchema);