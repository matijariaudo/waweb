const { server } = require("./models")
const cron = require("node-cron");
const { initWA } = require("./controllers/wa");

const init=async()=>{
    console.clear();
    const Server=new server();
    Server.listen();
    await initWA();
}


cron.schedule("*/3 * * * * * *", function () {
    //segundo,minuto,hora,dia,mes,diaDeSemana
    //Intervalos '* * * * * 1-5' De lunes a viernes a cada minuto
    //Lapso temp: '*/8 * * * * *' Cada 8 segundos
    //Definir : '00 15 */1 * * *' a cada hora y 15 seg.
    //console.log("running a task every 15 seconds "+ new Date());
},{
    scheduled: true,
    timezone: "America/Bogota"
});
  
  

init()
