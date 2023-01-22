const {Router}=require('express');
const path=require('path');
const { loginJWT, ModificarUsuario, loginGoogle, loginCorreo, CrearUsuario } = require('../controllers/postUsuarios');
const { campainCracion, campainModificacion, campainModificacionMsg, CampainShow, AveriguarEstado, EnviarMensaje, AveriguarQr } = require('../controllers/postCampains');
const { enviarWA } = require('../models');

const {
    validarUsuarioCreacion,
    validarUsuarioModificacion,
    validarUsuarioLogin,
    validarUsuarioJwt,
    validarAppCreacion,
    validarComercioCreacion,
    validarCampainCreacion,
    validarCampainModificacion,
    validarCampainModificacionMsg
} = require('../middleware/validaciones');

const router=Router()

//Users administration
//router.get('/:dat',async(req,res)=>{
    //await enviarWA({from:"50765344314",to:"+5493406460886",msg:req.params.dat})
    //return res.status(200).json({
    //    status: req.params.dat
    //})
//});

//Campain administration
router.post('/campain',validarCampainCreacion,campainCracion)
router.post('/campain/:uid',validarCampainModificacion,campainModificacion)
router.post('/campain/:uid/:uidMsg',validarCampainModificacionMsg,campainModificacionMsg)
router.post('/getcampain',validarUsuarioJwt,CampainShow)
//Users administration
router.post('/usuarios',validarUsuarioCreacion,CrearUsuario);
router.post('/usuarios/login',validarUsuarioLogin,loginCorreo);
router.post('/usuarios/:uid',validarUsuarioModificacion,ModificarUsuario);
router.post('/usuarios/:id/validar',validarUsuarioJwt,loginJWT);

router.post('/:nro/estado',validarUsuarioJwt,AveriguarEstado)
router.post('/:nro/qr',validarUsuarioJwt,AveriguarQr)
router.post('/:nro/enviar',validarUsuarioJwt,EnviarMensaje)
//---router.post('/usuarios/login/google',loginGoogle)


//Default
router.use('*',(req,res)=>{res.json({error:"No es posible conectar"})})

module.exports=router