const { Wsp, Phone } = require(".././models");


const initWA=async()=>{
    const telefonos=(await Phone.find({status:"active"}));
    const wsp=new Wsp();
    //console.log(telefonos)
    //console.log(telefonos.filter(a=>a.session==='connect' || a.session==='initializing'))
    //await Promise.all(telefonos.map(async(b)=>{
    await Promise.all(telefonos.filter(a=>a.session==='connect' || a.session==='initializing').map(async(b)=>{
            const inst=await wsp.Instance(b.id)
    }));
}    


module.exports={initWA}