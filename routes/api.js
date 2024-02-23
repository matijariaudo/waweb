const {Router}=require('express');
const path=require('path');

const {
    validarUsuarioCreacion,
    validarUsuarioModificacion,
    validarUsuarioLogin,
    validarUsuarioJwt,
} = require('../middleware/validaciones');
const { loginJWT, ModificarUsuario, loginCorreo, CrearUsuario } = require('../controllers/postUsuarios');
const { EnviarMensaje,  getChats, getChat, getMessages, getConctacts } = require('../controllers/postCampains');
const { phoneCreacion , AveriguarQr, phoneShow, removePhone} = require('../controllers/postPhones');

const router=Router()



//Users administration
router.post('/usuarios',validarUsuarioCreacion,CrearUsuario);
router.post('/usuarios/login',validarUsuarioLogin,loginCorreo);
router.post('/usuarios/:uid',validarUsuarioModificacion,ModificarUsuario);
router.post('/usuarios/:id/validar',validarUsuarioJwt,loginJWT);

//Phones administration
router.post('/instance/get',validarUsuarioJwt,phoneShow);
router.post('/instance/create',validarUsuarioJwt,phoneCreacion);
router.post('/instance/qr',validarUsuarioJwt,AveriguarQr)
router.post('/instance/delete',validarUsuarioJwt,removePhone)
router.post('/instance/send',validarUsuarioJwt,EnviarMensaje) 
router.post('/instance/chats',validarUsuarioJwt,getChats)
router.post('/instance/chat',validarUsuarioJwt,getChat)
router.post('/instance/contact',validarUsuarioJwt,getConctacts)
router.post('/instance/messages',validarUsuarioJwt,getMessages)


//Default
router.use('*',(req,res)=>{res.json({error:"No es posible conectar"})})

module.exports=router