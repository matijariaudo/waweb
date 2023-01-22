const { User } = require("../models");
const {OAuth2Client} = require('google-auth-library');
const bcryptjs=require('bcrypt')
var jwt = require('jsonwebtoken');

const CrearUsuario=async(req,res)=>{
    const {nombre,correo,clave}=req.body;
    const user=await User.findOne({correo,estado:true});
    if(user){return res.json({"errors":[{"msg":"El correo ya ha sido utilizado previamente."}]})}
    try {
        const salt=await bcryptjs.genSalt(10);
        const claveEncrypt=await bcryptjs.hash(clave,salt);
        const newuser=new User({nombre,correo,clave:claveEncrypt,rol:"USER_ROLE"});
        await newuser.save()
        return res.json({"status":"Se guardó correctamente"})
    } catch (error) {
        if(user){return res.json({"errors":[{"msg":"No se ha podido guarda en base de datos, intente nuevamente."}]})}
    }
}

const ModificarUsuario=async(req,res)=>{
    const {nombre,correo,clave,estado}=req.body;
    const {uid}=req.params;
    console.log(uid)
    const user_jwt=req.body.user_jwt;
    const user=await User.findById(uid);
    if(user_jwt.id!=uid && user_jwt.rol!='ADMIN_ROLE'){
        if(user){
            return res.json({"errors":[{"msg":"Usted no tiene los permisos para modificar los datos de la cuenta."}]})
        }else{
            return res.json({"errors":[{"msg":"No existe el usuario."}]})
        }
    }
    if(nombre){user.nombre=nombre;}
    const userCorreo=await User.findOne({correo,estado:true});
    if(userCorreo){
        return res.json({"errors":[{"msg":"El correo ya se ha sido registrado anteriormente."}]}) 
    }else{
        if(correo){user.correo=correo;}
    }
    if(estado!=null && user_jwt.rol=='ADMIN_ROLE'){user.estado=estado;}
    if(clave){
        const salt=await bcryptjs.genSalt(10);
        user.clave=await bcryptjs.hash(clave,salt);
    }
    user.save()
    return res.json({user})
}

const loginCorreo=async(req,res)=>{
    const {correo,clave}=req.body
    console.log(correo,clave)
    const user=await User.findOne({correo});
    if(!user){ 
        return res.json({"errors":[{"msg":"El correo/clave son incorrectos, intente nuevamente."}]})
    }
    const rta=await bcryptjs.compare(clave,user.clave);
    if(rta){
        const token=jwt.sign({ uid: user.id }, "Semilla",{expiresIn:'12h'})
        res.json({user,token})
    }else{
        if(user){return res.json({"errors":[{"msg":"El correo/clave son incorrectos, intente nuevamente."}]})}
    }
}

const loginGoogle=async(req,res=require)=>{
    const client = new OAuth2Client(process.env.GOOGLEID);
    try {
        const ticket = await client.verifyIdToken({idToken: req.body.id_token,audience: process.env.GOOGLEID});
        const {email,name,picture,} = ticket.getPayload();
        const payload={correo:email,nombre:name,img:picture,estado:true,google:true};
        const user=await user.findOne({correo:payload.correo});
        if(user){
            user.google=true;
            user.save();
            const token=jwt.sign({ uid: user.id }, "Semilla",{expiresIn:'4h'})
            return res.status(200).json({user,token});
        }else{
            const Newuser=new user(payload);
            Newuser.save();
            const userNew=await user.findById(Newuser.id)
            return res.status(200).json({user:Newuser});
        }        
    } catch (error) {
        if(user){return res.json({"errors":[{"msg":"Ha fallado la solicitud."}]})}
    }
}

const loginJWT=(req,res)=>{
    return res.status(200).json(req.body.user_jwt);
}

module.exports={CrearUsuario,loginGoogle,loginCorreo,ModificarUsuario,loginJWT}