//const { Campain } = require("../models");

const { Phone, Wsp } = require("../models");
const fsExtra = require('fs-extra');

const phoneShow=async(req,res)=>{
    const phones=await Phone.find({user:req.body.user_jwt._id,type:"cliente",status:"active"})
    return res.status(200).json(phones)
}

const fs = require('fs').promises;

const removePhone=async(req,res)=>{
    const {nro}=req.body;
    const phone_bus=await Phone.findOne({nro});
    if(!phone_bus){
        return res.status(200).json({error:"El telefono ya se encuentra registrado."})
    }    
    cerrar_sesion(nro);
    //fsExtra.remove('./.wwebjs_auth/session-'+nro);
    //phone_bus.status='delete';
    phone_bus.save()
    return res.status(200).json({status:"Se ha borrado correctamente"})
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