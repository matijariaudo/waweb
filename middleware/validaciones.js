const { User } = require("../models");
const { validationResult,body,param } = require('express-validator');
var jwt = require('jsonwebtoken');

const checkValidation=async(req,res,next)=>{
    const error=validationResult(req)
    if(error.errors.length>0){return res.json(error);}
    next()
}

const JWTValidation=async(token,{req})=>{
    //verify genera error solo si no hay resultado
    try {
        const rta=jwt.verify(token, 'Semilla');
        const usuario_jwt=await User.findById(rta.uid);
        if(usuario_jwt){
            req.body.user_jwt=usuario_jwt;
        }else{
            throw new Error(); 
        }
    } catch (error) {
        throw new Error();        
    }
}

const validarUsuarioCreacion=[
    body('nombre','No ingresó nombre').not().isEmpty(),
    body('correo','No ingresó correo').not().isEmpty(),
    body('clave','La clave debe tener al menos 6 caracteres').isLength({min:6}),
    checkValidation
];

const validarAppCreacion=[
    body('nombre','No ingresó nombre').not().isEmpty(),
    body('correo','No ingresó correo').not().isEmpty(),
    body('link','No ingresó link').not().isEmpty(),
    body('telefono','No ingresó telefono').not().isEmpty(),
    checkValidation
];

const validarComercioCreacion=[
    body('nombre','No ingresó nombre').not().isEmpty(),
    body('telefono','No ingresó correo').not().isEmpty(),
    body('envio','No ingresó envio').not().isEmpty(),
    body('direccion','No ingresó direccion').not().isEmpty(),
    body('ubicacion','No ingresó ubicacion').not().isEmpty(),
    checkValidation
];

const validarUsuarioModificacion=[
    body('nombre','No ingresó nombre').if(body('nombre').notEmpty()).isLength({min:4}),
    body('correo','El formato del correo es inválido').if(body('correo').notEmpty()).isEmail(),
    body('estado','El formato del estado es inválido').if(body('estado').notEmpty()).isBoolean(),
    body('clave','El formato de la clave es incorrecto').if(body('clave').notEmpty()).isLength({min:6}),
    body('token','El token no es válido').custom(JWTValidation),
    param('uid','El id no tiene formato adecuado.').isMongoId(),
    checkValidation
];

const validarUsuarioLogin=[
    body('correo','No ingresó correo').isEmail(),
    body('clave','La clave debe tener al menos 6 caracteres').isLength({min:6}),
    checkValidation,
];

const validarUsuarioJwt=[
    body('token','El token no es válido').custom(JWTValidation),
    checkValidation
]

const validarCampainCreacion=[
    body('msg','Debe ingresar un mensaje').notEmpty(),
    body('token','Debe ingresar un token').notEmpty(),
    body('to','Debe ingresar un destinatario').isArray().notEmpty(),
    body('token','El token no es válido').custom(JWTValidation),
    checkValidation
]
const validarCampainModificacion=[
    body('status','El formato del estado no es válido.').if(body('status').notEmpty()).isIn(["pendiente","pausado","eliminado"]),
    body('token','El token no es válido').custom(JWTValidation),
    param('uid','El id de la campaña no tiene formato adecuado.').isMongoId(),
    checkValidation
];

const validarCampainModificacionMsg=[
    body('sendStatus','El formato del estado no es válido.').if(body('status').notEmpty()).isIn(["pendiente","eliminado"]),
    param('uid','El id de la campaña no tiene formato adecuado.').isMongoId(),
    param('uidMsg','El id de la campaña no tiene formato adecuado.').isMongoId(),
    body('token','El token no es válido').custom(JWTValidation),
    checkValidation
];


module.exports={
    validarUsuarioCreacion,
    validarUsuarioModificacion,
    validarUsuarioLogin,
    validarUsuarioJwt,
    validarAppCreacion,
    validarComercioCreacion,
    validarCampainCreacion,
    validarCampainModificacion,
    validarCampainModificacionMsg
}