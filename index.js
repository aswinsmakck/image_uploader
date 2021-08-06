const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs')
const dir = require('node-dir');

const app = express();

const localDiskStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        console.log('hi');
        let date = new Date();
        let rootPath = 'public/images'
        let imagePath = `${rootPath}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        fs.stat(imagePath, (err, stats)=>{
            if(err){
                fs.mkdir(imagePath , {recursive : true}, (err)=> {
                    if(err) cb(new Error("Error while creating directory"))

                    cb(null, imagePath);
                })
            }
            else{
                cb(null, imagePath);
            }
        });
    },
    filename : (req, file, cb) => {
        //cb(new Error("broke"));
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

function readFilesFromDirPromise(imgPath){
    return new Promise((resolve, reject) => {
        /*fs.readdir(imgPath, (err, files) => {
            if(err) reject(err);
            resolve(files);           
        });*/

        /*dir.files(imgPath,
            function(err, files){
                if (err) reject(err);
                resolve(files)
            });*/
        let files = [];

        fs.readdir(imgPath, (err, dirItems) => {
            console.log(`-------------------${imgPath}---------------`);
            console.log(err);
            console.log(dirItems);
            if (err) return reject(err);
            let len = dirItems.length;
            if (!len) return resolve(files);

            dirItems.forEach( (dirItem) => {
                dirItem = imgPath + "/" + dirItem;
                console.log(dirItem);
                fs.stat(dirItem, (err, stat) => {
                    if(err) reject(err);
                    if (stat && stat.isDirectory()) {
                        //console.log(stat);
                        readFilesFromDirPromise(dirItem).then((res) =>{
                            files = files.concat(res);
                            if (!--len) resolve(files);
                        }).catch(err=> reject(err));
                            
                    }
                    else {
                        files.push(dirItem);
                        if (!--len) resolve(files);
                    }
                });
            });
        })
    });
}

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : false}));
app.use(express.json());
//app.use(multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'))

app.set('view engine', 'ejs')
//app.set('views','viewss')

app.get('/',(req, res, next)=>{
    res.render("index", {showModal : false})
});

app.get('/showModal', (req,res,next)=>{
   
    readFilesFromDirPromise('public/images')
    .then(files => {
        console.log('in agg get',files);
        res.render("index", {showModal : true, images : files, path : "images"})
    })
    .catch(err =>{
        next(err)
        //res.render("index", {showModal : false});
    })    
});


app.post('/upload/file', multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'), (req, res, next)=>{
    res.redirect('/showModal');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
 });

app.listen(5000);