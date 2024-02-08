const { Socket } = require("socket.io");

const socketController=async(socket,io)=>{
    console.log("conectado")
    socket.on('enviar-mensaje',({uid,nombre,mensaje})=>{
        
    })
}


module.exports={socketController}