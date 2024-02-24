const { Client , LocalAuth , MessageMedia} = require('whatsapp-web.js');
const Campain = require('./campain');
const { cola, ColaMsg, genAleatorio } = require('../controllers/cronSend');
const Mensage=require('./mensage')
const Phone=require('./phone');
const { obtenerSocket } = require('./server');

class Instances{
    constructor(id){
        this.id=id;
        this.qr="";
        this.phone={}
        this.session="initializing";
    }
    async init(){
        let primera=true;
        let phone;
        phone=await Phone.findById(this.id)
        console.log("Starting: "+this.id)
        return new Promise(async(resolve, reject) => {
            this.client = new Client({authStrategy: new LocalAuth({ clientId: this.id }), puppeteer: {headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']}});
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
            this.client.on('ready', async(aaa)=>{
                //obtenerSocket.getInstance().io.emit('recibir',{nro:this.nro,connection:"online"})
                this.session="connect";this.qr="";primera=false;console.log("Ready to use: "+this.id);
                phone.session="connect";phone.save();
                this.phone=await this.client.info.wid;
                resolve(true);
            });
            this.client.on('disconnected', async(r) => {
                this.session="disconnect";this.qr="";primera=false;console.log("Issue: "+this.nro);
                phone.session="disconnect";phone.save();
                this.init();
            });
            this.client.on('message', message => {
                //console.log("+"+message.from.split("@")[0],message.body);
            });
            await this.client.initialize()
        });
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
}

module.exports={Wsp}


