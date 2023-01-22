const { Client , LocalAuth , MessageMedia} = require('whatsapp-web.js');
const wa=[]

class Wsp{
    constructor(nro){
        this.nro=nro;
        this.qr="-";
        this.sesion="iniciando";
    }
    
    async init(){
        let primera=true;
        return new Promise((resolve, reject) => {
        this.client = new Client({authStrategy: new LocalAuth({ clientId: this.nro }), puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        }});
        this.client.on('qr', (qr) => {
            this.qr=qr;
            this.sesion="qr";
            if(primera){primera=false;resolve(true);}
        });
        this.client.on('ready', async()=>{this.sesion="conectado";console.log("ready "+this.nro);resolve(true);});
        this.client.on('message', message => {console.log("+"+message.from.split("@")[0],message.body);});
        this.client.initialize()
        });
    }

    async status(){
        return new Promise((resolve, reject) => {
            const estado = this.client.getState();
            if(estado) resolve(estado)        
        })
    }

    async send({to,msg,url}){
        return new Promise(async(resolve, reject) => {
            const chatId = to.substring(1) + "@c.us";
            if(url){
                const media=await MessageMedia.fromUrl(url)
                this.client.sendMessage(chatId, media);
            }
            this.client.sendMessage(chatId, msg);
            resolve(true)       
        })
    }
}


module.exports={Wsp}


