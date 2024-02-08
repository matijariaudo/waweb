const  Mensage  = require("../models/mensage");
const mongoose=require('mongoose')

const genAleatorio=(minInterval,maxInterval)=>{
    const aleatorio=Math.random();
    const interval = ( aleatorio * (maxInterval - minInterval) + minInterval) * 1000;
    return interval
}


const cola=async(limite,nroMsg,statusMsg)=>{
    const proximo = await Mensage.aggregate([ 
        { $match:{sendStatus:statusMsg}},
        { $lookup:{from: "campains",localField: "campain",foreignField: "_id", as: "campain" } },
        { $lookup:{from: "contactos",localField: "nro",foreignField: "nro", as: "phone" } },
        { $project:{_id:-1,nro:1,sendStatus:1,campain:{msg:1,status:1,date_start:1},phone:1}},
        { $match:{'campain.date_start':{$lt: new Date()},'campain.status':'pendiente','phone.phone':nroMsg}},
        { $sort: {'campain.date_start':1}},
        { $limit:limite},
        { $project:{_id:-1,nro:1,sendStatus:1,phone:1,campain:{msg:1,status:1}}},
    ]);
    return proximo;
}

const colaCampain=async(limite,idCampain,statusMsg)=>{
    let filt={};if(statusMsg){filt={sendStatus:statusMsg}}
    const proximo = await Mensage.aggregate([ 
        { $match:filt},
        { $match:{'campain':mongoose.Types.ObjectId(idCampain)}},
        { $lookup:{from: "contactos",localField: "nro",foreignField: "nro", as: "phone" } },
        { $project:{_id:-1,nro:1,sendStatus:1,sendFrom:1,sendDate:1,sendFrom:1,phone:{phone:1}}},
        { $limit:limite},
    ]);
    return proximo;
}


module.exports={cola,genAleatorio,colaCampain};