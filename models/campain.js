const {Schema,model} = require('mongoose')

const campainSchema=Schema({
    msg:{type:String,default:"-",require:[true,"Debe indicarse un mensaje."]},
    to:[{
        nro:{type:String,default:"-"},
        sendStatus:{type:String,default:"cola"},
        sendFrom:{type:String,default:"-"},
        sendDate:{type:Date,default:0}
    }],
    date:{type:Date},
    date_start:{type:Date},
    user:{type:Schema.Types.ObjectId,ref:'User'},
    status:{type:String,default:"pendiente"}
});
campainSchema.methods.toJSON= function(){
    const {__v,_id,... campain}=this.toObject();
    campain.uid=_id;
    return campain;
}

module.exports=model('Campain',campainSchema)