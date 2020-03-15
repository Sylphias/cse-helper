
const multer = require("multer");
const fs = require("fs");
const {exec} = require("child_process");
const {PROJ_PATH} = require("./env");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" +file.originalname );
  }
});

const isMulterError = (err)=>{
  return err instanceof multer.MulterError;
};

const isFileCSR = (filename)=>{
  const csrRegex = /([\d\D]+).csr/gi;
  return csrRegex.test(filename);
};

const filter = (req, file, cb)=>{
  if(!isFileCSR(file.originalname)){
    cb(new Error("Not CSR file"));
  }
  cb(null,true);
};

const deleteFiles = (filename)=>{
  fs.unlink(`public/${filename}.crt`,(err)=>{if(err)(console.log(err));});
  fs.unlink(`public/${filename}.csr`,(err)=>{if(err)(console.log(err));});
  console.log("files deleted");
};

const writeFile = async (filename, res)=>{
  const file = fs.createWriteStream(`public/${filename}.csr`,{autoClose:true});
  if(res){
    await res.data.pipe(file);
  }
};

const signFile = (filename,callback)=>{
  return new Promise((resolve,reject)=>{
    exec(`cd ${PROJ_PATH} && openssl x509\
    -req -in public/${filename}.csr -CA scripts/cacse.crt -CAkey scripts/cacse.key\
   -CAcreateserial -out public/${filename}.crt`,(err,stdout,stderr)=>{callback(err,stdout,stderr,resolve,reject)});
  });
};

const upload = multer({ storage: storage , fileFilter:filter}).single("file");

module.exports ={
  upload,
  isFileCSR,
  isMulterError,
  deleteFiles,
  writeFile,
  signFile
};
