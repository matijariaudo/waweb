const {Schema,model} = require('mongoose')

const userSchema=Schema({
    nombre:{
        type:String,
        default:"-",
        require:[true,"El nombre es obligatorio."]
    },
    correo:{
        type:String,
        require:[true,"El correo electrónico es obligatorio"],
        unique:true
    },
    clave:{
        type:String,
        default:"-",
        require:[true,"La clave es obligatoria"],
    },
    img:{
        type:String,
        default:"-"
    },
    rol:{
        type:String,
        default:"USER_ROLE",
        require:true,
        emun:['USER_ROLE','SELLER_ROLE','ADMIN_ROLE']
    },
    plan:{
        type:Number,
        default:0
    }
    ,
    google:{
        type:Boolean,
        default:false
    },
    estado:{
        type:Boolean,
        default:true
    }
});

//quita el password de la rta
userSchema.methods.toJSON= function(){
    const {__v,clave,_id,... user}=this.toObject();
    user.uid=_id;
    return user;
}

module.exports=model('User',userSchema)