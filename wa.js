const qrcode = require('qrcode-terminal');
const { Client , LocalAuth ,MessageMedia} = require('whatsapp-web.js');

const iniciarWA=async({nro})=>{
    return new Promise((resolve, reject) => {
        conex=false;
        const client = new Client({authStrategy: new LocalAuth({ clientId: nro })});
        client.on('qr', (qr) => {console.log(qr);console.log(new Date());});
        client.on('ready', async()=>{conex=true;console.log("está ready :)");resolve(client);});
        client.on('message', message => {console.log("+"+message.from.split("@")[0],message.body);});
        client.on('authenticated',()=>{ console.log("Autenticaddoooo")})
        client.on('change_state', state => {console.log("Hay cambio de estado: "+state);})
        client.on('disconnected', message =>{conex=false;client.destroy();iniciarWA({nro});console.log(" ASASe ha cerradoooooo! "+message);});
        client.initialize()
        setTimeout(()=>{
            conex?console.log("Ha iniciado OK"):console.log("No pudo iniciar");
        },30000)
        setInterval(async() => {
            if(conex){
            a=await client.getState();
            }else{
            a="Desconectado"
            }
            //console.log(a)
        }, 3000);
    })
}

const enviarMensaje = async({from,to,msg,img})=>{
    // Number where you want to send the message.
    if(!wa[from]){return false;}
    const number = to;
    const text = msg;
    const chatId = number.substring(1) + "@c.us";
    wa[from].sendMessage(chatId, text);
    if(img){
        const media=await MessageMedia.fromUrl(img)
        wa[from].sendMessage(chatId, media);
    }
}

console.clear()
const wa=[];
init();
async function init(){
let nroFrom="5493406460886"
nroFrom="50765344314"
console.log("Iniciando "+nroFrom)
wa[nroFrom]=await iniciarWA({nro:nroFrom});
console.log("Inició")
var stdin = process.openStdin();
stdin.addListener("data", d=>{
    enviarMensaje({from:nroFrom,to:"+5493406460886",msg:d.toString().trim()})
    });
}