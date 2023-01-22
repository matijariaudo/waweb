const {Schema,model} = require('mongoose')

const phoneSchema=Schema({
    nro:{type:String,default:"-",require:[true,"Debe indicarse un mensaje."]},
    user:{type:Schema.Types.ObjectId,ref:'usuario'},
    status:{type:String,default:"pendiente"}
});
phoneSchema.methods.toJSON= function(){
    const {__v,_id,... campain}=this.toObject();
    campain.uid=_id;
    return campain;
}

module.exports=model('Phone',phoneSchema)