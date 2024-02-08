const {Schema,model} = require('mongoose')

const contactoSchema=Schema({
    nro:{type:String,default:"-",require:[true,"Debe indicarse un número."]},
    phone:{type:String}
});
contactoSchema.methods.toJSON= function(){
    const {__v,_id,... contacto}=this.toObject();
    contacto.uid=_id;
    return contacto;
}

module.exports=model('Contacto',contactoSchema)