//const { Campain } = require("../models");

const { Phone, Wsp } = require("../models");
const fsExtra = require('fs-extra');

const phoneShow=async(req,res)=>{
    const phones=await Phone.find({user:req.body.user_jwt._id,type:"cliente",status:"active"})
    return res.status(200).json(phones)
}

const fs = require('fs').promises;

const removePhone=async(req,res)=>{
    const {instanceId}=req.body;
    const phone_bus=await Phone.findById(instanceId);
    if(!phone_bus){
        return res.status(200).json({error:"El no se encuentra registrado."})
    }    
    fsExtra.remove('./.wwebjs_auth/session-'+phone_bus.id);
    phone_bus.status='delete';
    phone_bus.save()
    console.log("ELIMINAR",'./.wwebjs_auth/session-'+phone_bus.id)
    return res.status(200).json({status:"Se ha borrado correctamente",phone_bus})
}

const phoneCreacion=async(req,res)=>{
    const {name}=req.body;
    const phone=new Phone({name,user:req.body.user_jwt._id});
    phone.save()
    return res.status(200).json(phone);
}

const AveriguarQr=async(req,res)=>{
    const {instanceId}=req.body;
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId)
    console.log("ins",instance)
    if(!instance){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const data=await instance.getProp()
    return res.status(200).json({data})
}

module.exports={phoneCreacion,AveriguarQr,phoneShow,removePhone}