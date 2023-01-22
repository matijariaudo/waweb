const express=require('express')
const { dbConnection } = require('../database/DBconfig')
require('dotenv').config()
const path=require('path')

class server{
    constructor(){
        this.app=express();
        this.dbConnect()
        this.middlewares();
        this.path={
            base:'/api'
        }
        this.routes();
    }

    middlewares(){
        this.app.use(express.json())
    }
    
    async dbConnect(){
        //await dbConnection();
    }

    routes(){
        this.app.use(express.static('public'));
        this.app.use('/api',require('../routes/api'))
        //this.app.use('',require('../routes/web'))
        this.app.use(express.static('public'));
    }

    listen(){
        const port = process.env.PORT
        this.app.listen(port, () => {console.log(`Example app listening on port ${port}`)});
    }

}

module.exports={server}