const { error } = require("qrcode-terminal");

const func = async () => {
    setTimeout(() => {
        return("Whoops!"); 
    }, 3000);
};

async function initi() {
    try {
        const a=await func();
        console.log(a)
    } catch (e) {
        console.log("1")
        console.log("Hay error:",e)
    }  
}

initi()