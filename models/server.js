const express=require('express')
const { dbConnection } = require('../database/DBconfig')
require('dotenv').config()
const path=require('path');
//const { socketController } = require('../controllers/socket');

class server{
    constructor(){
        this.app=express();
        this.dbConnect()
        this.middlewares();
        
        this.server=require('http').createServer(this.app);
        //this.io = require('socket.io')(this.server);
        //Establezco la primer instancia
        //obtenerSocket.getInstance(this.io)
        //this.socket()
        this.path={
            base:'/api'
        }
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());
    }
    
    async dbConnect(){
        await dbConnection();
    }

    socket(){
        //console.log("conectando socket")
        //this.io.on('connection',(socket)=>{socketController(socket,this.io);})
    }

    
    obtener_socket(){
        //return this.io
    }

    routes(){
        this.app.use(express.static(path.join(__dirname, "js")));
        this.app.use('/api',require('../routes/api'))
        //this.app.use('',require('../routes/web'))
        this.app.use(express.static('public'));
    }


    async listen(){
        const port = process.env.PORT
        this.server.listen(port, () => {console.log(`Example app listening on port ${port}`)});
    }

}

class guardarSocket{
    constructor(io){
        this.io=io;
    }
}
class obtenerSocket{
    constructor() {
        throw new Error('Use obtenerStocket.getInstance()');
    }
    static getInstance(io) {
        if (!obtenerSocket.guardoInstancia) {
            obtenerSocket.guardoInstancia = new guardarSocket(io);
        }
        return obtenerSocket.guardoInstancia;
    }
}


module.exports={server,obtenerSocket}