const { text } = require('express');
const {Schema,model} = require('mongoose')

const phoneSchema=Schema({
    name:{type:String,default:"-",require:[true,"Name is required."]},
    user:{type:Schema.Types.ObjectId,ref:'usuario'},
    status:{type:String,default:"active"},
    session:{type:String,default:"pending"},
    type:{type:String,default:"cliente"},
    number:{type:Number},
    webhook:{type:String},
    plan:{type:Number}
});
phoneSchema.methods.toJSON= function(){
    const {__v,_id,... campain}=this.toObject();
    campain.uid=_id;
    return campain;
}

module.exports=model('Phone',phoneSchema)