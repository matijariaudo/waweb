//const { Campain } = require("../models");

const { Phone, Wsp } = require("../models");


const phoneShow=async(req,res)=>{
    const phones=await Phone.find({user:req.body.user_jwt._id,type:"cliente",status:"active"})
    return res.status(200).json(phones)
}

const phoneChange=async(req,res)=>{
    const {instanceId,name,webhook}=req.body;
    const phone=await Phone.findById(instanceId);
    if(!phone){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    if(name){phone.name=name;}
    if(webhook){phone.webhook=webhook;}
    phone.save();
    return res.status(200).json(phone)
}

const checkStatuClass=async(req,res)=>{
    const phones=await Phone.find({user:req.body.user_jwt._id,type:"cliente",status:"active"})
    const wsp=new Wsp();
    const data=await wsp.getInfo();
    return res.status(200).json({data})
}

const fs = require('fs').promises;

const removePhone=async(req,res)=>{
    const {instanceId}=req.body;
    const phone_bus=await Phone.findById(instanceId);
    if(!phone_bus){
        return res.status(200).json({error:"El no se encuentra registrado."})
    }    
    const wsp=new Wsp();
    const instance=await wsp.getInstance(instanceId);
    if(instance){
        const props=await instance.getProp()
        if(props.session=="connect" || props.session=="pending"){
            await instance.destroyInstance();
        }    
    }
    phone_bus.status='delete';
    phone_bus.save();
    return res.status(200).json({status:"Se ha borrado correctamente",phone_bus})
}

const phoneCreacion=async(req,res)=>{
    const {name,webhook}=req.body;
    const phone=new Phone({name,user:req.body.user_jwt._id,webhook});
    phone.save()
    return res.status(200).json(phone);
}

const AveriguarQr=async(req,res)=>{
    const {instanceId}=req.body;
    const phone=await Phone.findById(instanceId);
    if(!phone){return res.status(200).json({status:"error",error:"Incorrect instanceID value."})}
    const wsp=new Wsp();
    let instance=await wsp.getInstance(instanceId);
    if(!instance){
        console.log("Init intance: ",instanceId);
        instance=await wsp.Instance(instanceId);
    }
    const data=await instance.getProp()
    console.log(data)
    return res.status(200).json({data})
}

module.exports={phoneCreacion,AveriguarQr,phoneShow,removePhone,checkStatuClass,phoneChange}