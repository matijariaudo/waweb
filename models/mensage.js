const {Schema,model} = require('mongoose')

const mensageSchema=Schema({
    nro:{type:String,default:"-"},
    sendStatus:{type:String,default:"cola",require:[true,"Debe indicarse un número."]},
    sendFrom:{type:String,default:"-"},
    sendDate:{type:Date,default:0},
    campain:{type:Schema.Types.ObjectId,ref:'Campain'},
});

module.exports=model('Mensage',mensageSchema)