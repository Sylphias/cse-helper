const express = require("express");
const app = express();
const cors = require("cors");
const {initializeBot} = require("./bot");
const {upload,deleteFiles,signFile} = require("./file_utils");
app.use(cors());

const apiSignFileCallback = (err,stdout,stderr,resolve,reject)=>{
  if(err){
    console.log(err);
    reject("Failed To Sign File");
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  resolve(stdout);
};

app.post("/upload",(req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    let filename = "";
    try{
      filename = /([\d\D]+).csr/gi.exec(req.file.filename)[1];
    }
    catch(e){
      console.log(err);
      return res.status(500).json(err);
    }
    if(filename != null || filename != undefined || filename != ""){
      // Perform Cert Signing
      signFile(filename,apiSignFileCallback);
    }else{
      return res.status(500).json();
    }
    // Returned Signed file address
  });
});

app.get("/signed",(req,res) => {
  res.download(`public/${req.query.filename}.crt`, `${req.query.filename}.crt`, (err)=>{
    if (err) {console.log(err);} 
    else {
      console.log("Sent:", req.query.filename);
      deleteFiles(req.query.filename);
    }
  });
});

app.listen(8000, () => {
  console.log("App running on port 8000");
});

initializeBot();
