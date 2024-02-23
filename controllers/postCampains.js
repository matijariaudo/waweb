const { Campain, Mensage, Contacto, Phone, Wsp } = require("../models");
const { obtenerSocket } = require("../models/server");
const { obtener_estado, enviar_mensaje, obtener_qr } = require("./wa");
var mongoose = require('mongoose');

const EnviarMensaje=async(req,res)=>{
    const {instanceId,message,to}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    if(data.session!="connect"){return res.status(200).json({status:"error",error:"The session must be connected."})}
    try {
        const msg=await instance.send({to,msg:message})
        return res.status(200).json({status:"OK",data:"enviado"})
    } catch (error) {
        return res.status(200).json({status:"error",error})
    }
}

const getChats=async(req,res)=>{
    const {instanceId}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    if(data.session!="connect"){return res.status(200).json({status:"error",error:"The session must be connected."})}
    const chats=await instance.getChats();
    return res.status(200).json({status:"OK",chats})
}

const getChat=async(req,res)=>{
    const {instanceId,chatId,qty}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    if(data.session!="connect"){return res.status(200).json({status:"error",error:"The session must be connected."})}
    const chat=await instance.getChat(chatId,qty);
    return res.status(200).json({status:"OK",chat})
}

const getConctacts=async(req,res)=>{
    const {instanceId,chatId,qty}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    if(data.session!="connect"){return res.status(200).json({status:"error",error:"The session must be connected."})}
    const chat=await instance.getConctacts();
    return res.status(200).json({status:"OK",chat})
}

const getMessages=async(req,res)=>{
    const {instanceId,chatId,qty}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    if(data.session!="connect"){return res.status(200).json({status:"error",error:"The session must be connected."})}
    const messages=await instance.getMessages(chatId,qty);
    return res.status(200).json({status:"OK",messages})
}


module.exports={getChats,getChat,getMessages,EnviarMensaje,getConctacts}