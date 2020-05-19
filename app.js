const express = require('express')
const ejs = require('ejs')
const multer = require('multer')
const path = require('path')


// Storage Engine
const storage = multer.diskStorage({
   destination:'./public/uploads',
   filename:function(req,file,cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))  //fieldname is the name which we have written in input tag in this case is myImage and Date.now() is used to generate random number of file so that it should not match with original filename and last part is to generate extension name which is .jpeg,.png,.exe etc 
   } 
})

// init upload
const upload = multer({
   storage:storage,  //where to store the file
   limits:{fileSize:100000},  //Limits of the uploaded image 
   fileFilter:function(req,file,cb){  //	Function to control which files are accepted here we accept only .png,.jpeg files means only images
      checkFileType(file,cb)
   }
}).single('myImage')

// Check File Type
function checkFileType(file,cb){
   //   Allowed ext
   const filetypes = /jpeg|png|jpg|gif/
   // check extension name
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
   // check mime type
   const mimetype = filetypes.test(file.mimetype)

   if(mimetype && extname){
      return cb(null,true)
   }else{
      cb('Error:Images Only!')
   }
}

const app = express();

// EJS
app.set('view engine','ejs')

// Public Folder
app.use(express.static('public'))

app.get('/',(req,res)=>{
   res.render('index')
})

app.post('/upload',(req,res)=>{
   upload(req,res,(err)=>{
      if(err){
         res.render('index',{
            msg:err
         })
      }else{
         
          if(req.file == undefined){
            res.render('index',{
               msg:'Error:No File Selected!'
          })
}else{
   // console.log(req.file)
   res.render('index',{
      msg:'File Uploaded!',
      file:`/uploads/${req.file.filename}`
   })
}  
      } 
})
   })

app.listen(5000,()=> console.log('Server started on port 5000'))