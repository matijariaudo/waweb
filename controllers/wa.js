const { Wsp, Phone } = require(".././models");


const initWA=async()=>{
    const telefonos=(await Phone.find({status:"active"})).map(e=>e.id);
    const wsp=new Wsp();
    //await Promise.all(telefonos.filter(a=>a=='65c0ca508d18bcd5962fa3bb').map(async(id)=>{
    await Promise.all(telefonos.map(async(id)=>{
            const inst=await wsp.Instance(id)
    }));
}    


module.exports={initWA}