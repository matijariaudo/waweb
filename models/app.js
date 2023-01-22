const {Schema,model} = require('mongoose')

const appSchema=Schema({
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
    telefono:{
        type:String,
        require:[true,"El correo electrónico es obligatorio"],
        unique:true
    },
    link:{
        type:String,
        require:[true,"El usuario es obligatorio"],
        unique:true
    },
    logo:{
        type:String,
        default:"-"
    },
    estado:{
        type:Boolean,
        default:true
    }
});

module.exports=model('App',appSchema)