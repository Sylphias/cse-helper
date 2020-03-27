//  This file handles all telegram requests

const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");
const {TELE_BOT_TOKEN} = require("./env");
const {isFileCSR,signFile,writeFile,deleteFiles} = require("./file_utils");
const fs = require("fs");
const axios = require('axios')
const { v1:uuidv1 } =  require('uuid');

const botSignFileCallback = (err,stdout,stderr,resolve,reject)=>{
  if(err){
    reject('Failed To Sign File')
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  resolve(stdout)
};

const initializeBot = ()=>{
  const bot = new Telegraf(TELE_BOT_TOKEN);
  const telegram = new Telegram(TELE_BOT_TOKEN);
  bot.start((ctx)=>{
    ctx.reply("Hello! I am the CSE Cert Bot. You can sign your certificate by sending me your file!");
  });
  bot.on("document", async (ctx)=>{
    doc = ctx.message.document;
    if(!doc){
      ctx.reply("Sorry, no files were received");
    }
    if(!isFileCSR(doc.file_name)){
      ctx.reply("Please upload a .CSR file! (No other filetypes are accepted)");
      return
    }
    
    ctx.reply("File Received, Please Wait!");
    const new_file_name = `${doc.file_name.split('.')[0]}-${uuidv1()}`
    try{
      const file_link = await telegram.getFileLink(ctx.message.document.file_id);
      const res = await axios.get(file_link,{responseType:"stream"}) 
      await writeFile(new_file_name,res)
      await signFile(new_file_name,botSignFileCallback)
      signed_file = fs.readFileSync(`public/${new_file_name}.crt`)
      await telegram.sendDocument(ctx.message.chat.id,{source:signed_file, filename:`${new_file_name}.crt`})
      ctx.reply("Thank you for signing with us! Please download the signed certificate to continue with the assignment!")
    }catch(err){
      console.log(err)
      ctx.reply("Sorry, there was an issue signing your file. Please try again!");
      deleteFiles(new_file_name)
    }
    // Download the file
  });
  bot.launch();
};


module.exports = {initializeBot};
