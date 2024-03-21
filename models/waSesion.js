const { Client , LocalAuth , MessageMedia} = require('whatsapp-web.js');
const Campain = require('./campain');
const { cola, ColaMsg, genAleatorio } = require('../controllers/cronSend');
const Mensage=require('./mensage')
const Phone=require('./phone');
const { obtenerSocket } = require('./server');
const fsExtra = require('fs-extra');

class Instances{
    constructor(id,{session}={session:"initializing"}){
        this.id=id;
        this.qr="";
        this.phone={}
        this.session=session?"initializing":"starting";
        
    }
    async init(){
        let phone;
        phone=await Phone.findById(this.id)
        phone.session=this.session;phone.save();
        let primera=true;
        console.log("Starting: "+this.id)
        return new Promise(async(resolve, reject) => {
            this.client = new Client({authStrategy: new LocalAuth({ clientId: this.id }),qrMaxRetries:1, puppeteer: {headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'],ignoreHTTPSErrors: true,defaultViewport: { width: 800, height: 600 }}});
            this.client.on('qr', async(qr) => {
                this.qr=qr;
                this.session="pending";
                phone.session="pending";phone.save();
                console.log("Needing QR: ",this.id,"QR : ",this.qr)
                if(primera){
                    primera=false;
                    resolve(true);
                }
            });
            this.client.on('authenticated',async()=>{
                phone=await Phone.findById(this.id)
                phone.session="connect";
                phone.save();
                console.log("Auth: ",this.id)
            })
            this.client.on('ready', async(aaa)=>{
                //obtenerSocket.getInstance().io.emit('recibir',{nro:this.nro,connection:"online"})
                this.session="connect";this.qr="";primera=false;
                console.log("Ready to use: "+this.id);
                this.phone=await this.client.info.wid;
                phone=await Phone.findById(this.id)
                console.log(await this.client.info.wid)
                phone.number=await this.client.info.wid.user;
                phone.save()
                resolve(true);
            });
            this.client.on('disconnected', async(r) => {
                primera=false;console.log("Issue: "+this.id);
                try {
                    this.destroyInstance();                
                } catch (error) {
                    console.error("Error al ejecutar destroyInstance():", error);
                    // Puedes agregar cualquier manejo adicional de errores aquí
                }
            });
            this.client.on('message', message => {
                //console.log("+"+message.from.split("@")[0],message.body);
            });
            await this.client.initialize()
        });
    }

    async destroyInstance(){
        this.session="disconnect";
        this.qr="";
        const phone=await Phone.findById(this.id)
        phone.session="disconnect";phone.save();
        if(this.session=='connect'){
            await this.client.logout();
        }
        await this.client.destroy();
        console.log("eliminar instancia")
        const wsp=new Wsp();
        await wsp.deleteIntance(this.id);
    }

    async getProp(){
        return {qr:this.qr,id:this.id,session:this.session,phone:this.phone};
    }

    async status(){
        return new Promise((resolve, reject) => {
            const estado = this.client.getState();
            if(estado) resolve(estado)        
        })
    }

    async cerrar_sesion(){
        return true;
    }

    async send({to,msg,url}){
        return new Promise(async(resolve, reject) => {
            try {
                const chatId = to.substring(1) + "@c.us";
                if(url){
                    const media=await MessageMedia.fromUrl(url)
                    this.client.sendMessage(chatId, media);
                }
                this.client.sendMessage(chatId, msg);
                resolve(true)
            } catch (error) {
                reject(error)    
            }
                   
        })
    }

    async getChats(){
        const chats=await this.client.getChats();
        return chats
    }
    async getChat(chatId,qty=20){
        const chat=await this.client.getChatById(chatId);
        return chat
    }

    async getMessages(chatId,qty=20){
        const chat=await this.client.getChatById(chatId);
        const messages = await chat.fetchMessages({ limit: qty });
        return messages
    }

    async getConctacts(){
        const contacts=await this.client.info.wid;
        return contacts;
    }
    

}

class Wsp {
    constructor() {
      this.instancias = {};
      if (Wsp.instance) {
        return Wsp.instance;
      }
      Wsp.instance = this;
      return this;
    }
  
    async Instance(id) {
      if (!this.instancias[id]) {
        console.log("New instance ",id)
        this.instancias[id] =new Instances(id);
        await this.instancias[id].init()
      }
      return this.instancias[id];
    }
    async getInstance(id) {
        if (!this.instancias[id]) {
            return false;
        }
        return this.instancias[id];
    }

    async deleteIntance(id){
        delete this.instancias[id]
        fsExtra.remove('./.wwebjs_auth/session-'+id);
    }

    async getInfo(){
        const key=Object.keys(this.instancias)
        const rta=[]
        key.forEach(e => {
          rta.push(this.instancias[e])  
        });
        return rta.map(a=>{return {id:a.id,session:a.session}});
    }
}

module.exports={Wsp}


