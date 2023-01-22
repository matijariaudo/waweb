const {server}=require('./server')
const {Wsp}=require('./waSesion')
const Campain=require('./campain')
const User=require('./user')
const Phone=require('./phone')

const index={
    server,
    Wsp,
    Campain,
    User,
    Phone
} 

module.exports=index