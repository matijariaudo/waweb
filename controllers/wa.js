const { Wsp, Phone } = require(".././models");

const wsp=[];

const initWA=async()=>{
    const telefonos=(await Phone.find()).map(e=>e.id);
    console.log(telefonos)
    const wsp=new Wsp();
    await Promise.all(telefonos.filter(a=>a=='65c0ca508d18bcd5962fa3bb').map(async(id)=>{
        const inst=await wsp.Instance(id)
    }));
}    



const obtener_estado=async(nro)=>{
    if(!wsp[nro]){return {status:false,error:"No Registrado."}}
    if(wsp[nro].sesion=="iniciando"){return {status:false,error:"Iniciando"}}
    const e=await wsp[nro].status();
    if(!e){
        return {status:false,error:"Desconectado",qr: wsp[nro].qr};
    }else{
        return {status:true}
    }
}

const cerrar_sesion=async(nro)=>{
    return new Promise(async(resolve, reject) => {
        delete(wsp[nro])
        resolve(true);
    })
}

const enviar_mensaje=async({nro,to,msg,url})=>{
    if(!wsp[nro]){return {error:"No existe el nro indicado."}}
    if(wsp[nro].sesion=="iniciando"){return {error:"Aún no ha iniciado."}}
    const e=await wsp[nro].send({to:"+"+to,msg,url})
    return e;
}

const obtener_qr=async(nro)=>{
    if(!wsp[nro]){return {error:"No existe el nro indicado."}}
    if(wsp[nro].sesion=="iniciando"){return {error:"Aún no ha iniciado."}}
    const e={qr:await wsp[nro].qr,
    date: fecha()};
    return e;
}

function fecha(fc){
    fc?fc=new Date(fc):fc=new Date();
    ms=fc.getMonth()+1;ms<10?ms="0"+ms:true;
    d=fc.getDate();d<10?d="0"+d:true;
    h=fc.getHours();h<10?h="0"+h:true;
    m=fc.getMinutes();m<10?m="0"+m:true;
    s=fc.getSeconds();s<10?s="0"+s:true;
    return h+":"+m+":"+s+" "+d+"-"+ms+"-"+fc.getFullYear();
}

module.exports={initWA,obtener_estado,enviar_mensaje,obtener_qr,cerrar_sesion}