const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs')

const app = express();

const localDiskStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, 'public/images');
    },
    filename : (req, file, cb) => {
        cb(null, new Date().toISOString().replaceAll(':','') +'-'+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
        cb(null, true);
    }
    else{
        cb(null , false);
    }
}

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
//app.use(multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'))

app.set('view engine', 'ejs')
//app.set('views','viewss')

app.get('/',(req, res)=>{
    res.render("index", {showModal : false})
});

app.get('/showModal', (req,res)=>{
    fs.readdir('public/images', (err, files) => {
        images = files;
        res.render("index", {showModal : true, images : files, path : "images"})
    });
});


app.post('/upload/file', multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'), (req, res)=>{
    console.log(req)
    console.log(req.body);
    console.log(req.files);
    res.redirect('/showModal');
});

app.listen(5000);