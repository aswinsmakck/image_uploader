const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs')
const dir = require('node-dir');

const app = express();

const localDiskStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        try{
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
        }catch(err){
            cb(err);
        }
    },
    filename : (req, file, cb) => {
        try{
            //cb(new Error("broke"));
            cb(null, new Date().toISOString().replaceAll(':','') +'-'+file.originalname);
        }
        catch(err){
            cb(err);
        }
    }
});

const fileFilter = (req, file, cb) => {
    try{
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg'){
            cb(null, true);
        }
        else{
            cb(null , false);
        }
    }
    catch(err){
        cb(err);
    }
}

function getStatPromise(dirItem){
    return new Promise((resolve, reject)=>{
        fs.stat(dirItem, (err, stat) => {
            if(err) reject(err);
            resolve(stat);
        });
    })
}


function readFilesFromDirPromise(imgPath){
    return new Promise((resolve, reject) => {

        let files = [];

        fs.readdir(imgPath, (err, dirItems) => {
            console.log(`-------------------${imgPath}---------------`);
            console.log(err);
            console.log("dir items",dirItems);
            if (err) reject(err);
            
            resolve(dirItems)

            //result.then(res => {console.log("result",res);});
            //result.then(res => console.log(res));

            /*dirItems.forEach( (dirItem) => {
                dirItem = imgPath + "/" + dirItem;
                console.log(dirItem);
                
                isDirectoryPromise(dirItem)
                .then( isDir => {
                    if(isDir){
                        readFilesFromDirPromise(dirItem).then((res) =>{
                            files = files.concat(res);
                            if (!--len) resolve(files);
                        }).catch(err=> reject(err));
                    }
                    else{
                        files.push(dirItem);
                        if (!--len) resolve(files);
                    }
                })
                .catch(err => reject(err))
            });*/
        })
    });
}

/*getAllFiles('public/images').then(res => {
    console.log("main controller", res);

});*/
function getAllFiles(imgPath){
    
    let files = [];       

        return readFilesFromDirPromise(imgPath)
        .then(dirItems => {
            console.log("dircol", dirItems)
            let len = dirItems.length;
            if (!len){
                console.log("read addir in get all files", files)
                return (files);
            }

            return dirItems.reduce((accumulator, dirItem) => {
                dirItem = imgPath + "/" + dirItem;
                return accumulator.then( res => {
                    return getStatPromise(dirItem).then(stat => {
                        res.push({stat, dirItem})
                        return res;
                    })
                } )
            },Promise.resolve([]))
        })
        .then(res => {
            if (!res.length){
                console.log("after get stat", files)
                return (files);
            }



            /*let dirArray = [];

            res.forEach(item => {
                if(item.stat && item.stat.isDirectory()){
                    dirArray.push(item.dirItem);
                }
                else{
                    files.push(item.dirItem);
                }
            })

            console.log("dir array ", dirArray);
            console.log(dirArray.length == 0)
            if(dirArray.length == 0) 
            {
                return files;
            }
            else{*/
            let len = res.length;
            return res.reduce((accumulator, item) => {
                if(item.stat && item.stat.isDirectory()){
                    return accumulator.then(res => {                        
                        return getAllFiles(item.dirItem).then(res =>{
                            console.log("in recursive", res)
                            console.log("in recursive", files)
                            console.log("in recursive", item.dirItem)
                            //files = files.concat(res);
                            //return files;
                            //return [];
                            files = files.concat(res);
                            if(!--len) return files;
                        })
                    })
                }
                else{
                    console.log("in else files -- add", item.dirItem)
                    files.push(item.dirItem)
                    if(!--len) return files;
                }                       
            }, Promise.resolve([])) 
            
        })
        .then(res => {
            console.log("later", files)
            return files;
        });
            /*return dirItems.map(dirItem => {
                dirItem = imgPath + "/" +dirItem;
                //console.log()
                return ( 
                    getStatPromise(dirItem)
                    .then(stat => {
                        //console.log(stat);
                        return ({dirItem, stat})
                    })
                )
            })
        })
        .then(res => {
            let len = res.length;
            if (!len) return (files);
            res.reduce((accumulator, dirItemProm) => {
                return ( 
                    dirItemProm
                    .then((res) => {
                        let stat = res.stat;
                        let dirItem = res.dirItem;
                        console.log(stat && stat.isDirectory())
                        if(stat && stat.isDirectory()){
                            getAllFiles(dirItem,next).then((res) =>{
                                files = files.concat(res);
                                if (!--len) isRetAllowed = true;//resolve(files);
                            }).catch(err=> next(err));
                        }
                        else{
                            files.push(dirItem);
                            console.log("files - add", files)
                            console.log(!(len-1));
                            if (!--len) isRetAllowed = true;//resolve(files);
                        }
                    })
                )
            }, Promise.resolve());
        });
        /*.then(res => {
            let len = res.length;
            if (!len) return (files);

            let sortedArr = res.sort((a, b) => {
                return (b.stat.ctime.getTime() - a.stat.ctime.getTime())
            })
            
            sortedArr.forEach( (statObj) => {
                let stat = statObj.stat;
                let dirItem = statObj.dirItem;
                console.log(stat && stat.isDirectory())
                if(stat && stat.isDirectory()){
                    getAllFiles(dirItem,next).then((res) =>{
                        files = files.concat(res);
                        if (!--len) isRetAllowed = true;//resolve(files);
                    }).catch(err=> next(err));
                }
                else{
                    files.push(dirItem);
                    console.log("files - add", files)
                    console.log(!(len-1));
                    if (!--len) isRetAllowed = true;//resolve(files);
                }
            })
            console.log(isRetAllowed)
            if(isRetAllowed) return files;
            console.log("---------- end of res ------------------");
        }).then(res => {
            console.log(res);
            if(res) return res;
        })
        //.catch(err => next(err))*/

        return files;
}

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : false}));
app.use(express.json());
//app.use(multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'))

app.set('view engine', 'ejs')
//app.set('views','viewss')

app.get('/',(req, res, next) => {
    res.render("index", {showModal : false})
});

app.get('/showModal', (req,res,next)=>{
   
    getAllFiles('public/images',next)   
    .then(files =>{
        console.log("in app get",files);
        if(files){
            res.render("index", {showModal : true, images : files, path : "images"}) 
        }
    }).catch(err => next(err));

    /*readFilesFromDirPromise('public/images').then(files =>{
        console.log('in agg get',files);
        res.render("index", {showModal : true, images : files, path : "images"}) 
    });*/
});


app.post('/upload/file', multer({storage : localDiskStorage, fileFilter : fileFilter}).array('files'), (req, res, next)=>{
    res.redirect('/showModal');
});



app.use(function(req, res, next) {
    res.status(404).send('Invalid URL')
});


app.use(function(err, req, res, next) {
    if(err){
        console.log("err",err)
        console.error(err.stack);
        res.status(500).send('Someng broke!');
    }
});

app.listen(5000);