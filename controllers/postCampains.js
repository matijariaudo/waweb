const { Campain, Mensage, Contacto, Phone, Wsp } = require("../models");
const { obtenerSocket } = require("../models/server");
const { colaCampain } = require("./cronSend");
const { obtener_estado, enviar_mensaje, obtener_qr } = require("./wa");
var mongoose = require('mongoose');



const campainCracion=async(req,res)=>{
    let {msg,to,date_start}=req.body;
    if(!date_start){date_start=new Date();}else{date_start=new Date(date_start);}
    const campain=new Campain({msg,to,date:new Date(),date_start,user:req.body.user_jwt._id});
    await campain.save(async(er,e)=>{
        const campain=e.id;
        for(const b of to){
            cantidades=await Phone.aggregate([
                { $lookup:{from: "contactos",localField: "nro",foreignField: "phone", as: "contactos" } },
                { $project:{nro:1,cantidad:{$size:"$contactos"},_id:0}},
                { $sort:{cantidad:1}},
                { $limit:2}
            ]);
            contacto=await Contacto.find({nro:b.nro});
            if(contacto.length==0){
                const newContacto=new Contacto({phone:cantidades[0].nro,nro:b.nro});await newContacto.save();
            }
            const mensage=new Mensage({nro:b.nro,campain});
            await mensage.save();   
        }
    });
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
    const {id}=req.body;
    let cla1={$size:{$filter: {input: "$mensajes",as: "mensaje",cond: {"$eq": ["$$mensaje.sendStatus","enviado"]}}}};
    let cla2={$size:{$filter: {input: "$mensajes",as: "mensaje",cond: {"$eq": ["$$mensaje.sendStatus","cola"]}}}};
    let match={$or:[{status:"pendiente"},{status:"pausado"}]};
    if(id){cla1={$slice:[{$filter: {input: "$mensajes",as: "mensaje",cond: {"$eq": ["$$mensaje.sendStatus","enviado"]}}},5]};}
    if(id){cla2={$slice:[{$filter: {input: "$mensajes",as: "mensaje",cond: {"$eq": ["$$mensaje.sendStatus","cola"]}}},10]};}
    if(id){match={status:"pendiente",_id:mongoose.Types.ObjectId(id)}}
    obtenerSocket.getInstance().io.emit('recibir',{msg:"funciona gatitooo"})
    const campains=await Campain.aggregate([
    { $match : match},    
    { $lookup:{from: "mensages",localField: "_id",foreignField: "campain", as: "mensajes" }},
    { $lookup:{from: "users",localField: "user",foreignField: "_id", as: "user" }},
    { $project:{
            msg:1,date_start:1,user:1,status:1,
            Enviados:cla1,
            Cola:cla2
    }}
    ]);
    if(campains){
        return res.status(200).json(campains)
    }
    return res.status(200).json({"Status":"Se ha modificado"})
}

const CampainMensajes=async(req,res)=>{
    const {id}=req.body;
    const enviados=await colaCampain(100000,id,'enviado');
    const cola=await colaCampain(100000,id,'cola');
    return res.status(200).json({enviados,cola})
}

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


module.exports={getChats,getChat,getMessages,EnviarMensaje}