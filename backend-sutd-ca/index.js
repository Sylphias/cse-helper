const {PROJ_PATH} = require("./env");
const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const {exec} = require("child_process");
const fs = require("fs");
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" +file.originalname );
  }
});

const filter = (req, file, cb)=>{
  const csrRegex = /([\d\D]+).csr/gi;
  if(!csrRegex.test(file.originalname)){
    cb(new Error("Not CSR file"));
  }
  cb(null,true);
};

const upload = multer({ storage: storage , fileFilter:filter}).single("file");
function deleteFiles(filename){
  fs.unlink(`public/${filename}.crt`,(err)=>{console.log(err);});
  fs.unlink(`public/${filename}.csr`,(err)=>{console.log(err);});
  console.log("files deleted");
}
app.post("/upload",(req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    let filename = /([\d\D]+).csr/gi.exec(req.file.filename)[1];
    if(filename != null || filename != undefined || filename != ""){
      // Perform Cert Signing
      exec(`cd ${PROJ_PATH} && openssl x509 -req -in public/${filename}.csr -CA scripts/cacse.crt -CAkey scripts/cacse.key -CAcreateserial -out public/${filename}.crt`,(err,stdout,stderr)=>{
        if(err){
          console.log(err);
          return res.status(500).json(err);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return res.status(200).send({fileName:filename});
      });
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