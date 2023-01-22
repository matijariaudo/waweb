const {Router}=require('express');
const path=require('path');
const { App } = require('../models');
const router=Router();


router.get('/:app', async(req, res,next) => {
    const app = await App.findOne({link:req.params.app})
    if(!app){return next();}
    return res.render("food", {
    app: app.nombre, id: 1
    });
})
router.get('/:id',(req,res)=>{return res.sendFile(path.resolve('public/index.html'))})

module.exports=router
