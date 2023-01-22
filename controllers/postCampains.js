const { Campain } = require("../models");
const { obtener_estado, enviar_mensaje, obtener_qr } = require("./wa");



const campainCracion=async(req,res)=>{
    const {msg,to}=req.body;
    const campain=new Campain({msg,to,date:new Date(),user:req.body.user_jwt._id});
    campain.save()
    return res.status(200).json(campain)
}

const campainModificacion=async(req,res)=>{
    const {status}=req.body;
    const {uid}=req.params;
    const campain=await Campain.findByIdAndUpdate(uid,{status});
    return res.status(200).json(campain)
}


const campainModificacionMsg=async(req,res)=>{
    const {sendStatus}=req.body;
    const {uid,uidMsg}=req.params;
    if(uidMsg!="new"){
        const a=await Campain.updateOne({_id:uid,'to._id':uidMsg},{$set:{'to.$.sendStatus':sendStatus}})
    }
    return res.status(200).json({"Status":"Se ha modificado"})
}

const CampainShow=async(req,res)=>{
    const campains=await Campain.find({$or:[{status:'pendiente'},{status:'pausado'}]}).populate('user').sort({date:1})
    if(campains){
        return res.status(200).json(campains)
    }
    return res.status(200).json({"Status":"Se ha modificado"})
}

const AveriguarEstado=async(req,res)=>{
    const estado=await obtener_estado(req.params.nro)
    return res.status(200).json(estado)
}

const AveriguarQr=async(req,res)=>{
    const estado=await obtener_qr(req.params.nro)
    return res.status(200).json(estado)
}

const EnviarMensaje=async(req,res)=>{
    const estado=await enviar_mensaje({nro:req.params.nro,to:req.body.to,msg:req.body.msg,url:req.body.url})
    return res.status(200).json({"Status":estado})
}


module.exports={campainCracion,campainModificacion,campainModificacionMsg,CampainShow,AveriguarEstado,EnviarMensaje,AveriguarQr}