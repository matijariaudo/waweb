// Connection
const mongoose = require('mongoose');


const dbConnection=async()=>{
  try {
    mongoose.set('strictQuery', true);  
    //si lo hago con await y falla va al catch, sino puedo poner mongoose.connect(http..).then()
    await mongoose.connect(
    'mongodb+srv://user_mati:KkfzLEOHeHLbxEZm@clustercursonode.lnl88zd.mongodb.net/appWA',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    console.log("Base de datos conectada");
  }catch(error){
    console.log("Error en la conexion a Base de datos")  
  }
}

module.exports={dbConnection}