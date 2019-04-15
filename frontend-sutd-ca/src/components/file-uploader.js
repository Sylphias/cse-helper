import React, { Component } from "react";
import styled from "styled-components";
import UploadButton from "./upload-btn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FileDownload from "js-file-download";
import {
  Black,
  Green,
  LightBlue,
  Red,
  Yellow
} from "./colors";

const UploaderForm = styled.form`
  grid-area: upload-area;
  width:100%;
  height:100%
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction:column;
`;

const UploaderContainer = styled.div`
  height:300px;
  width:50%
  position:relative;
  display:flex;
  flex-direction:column
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
  border:2px dashed ${props=>props.theme.color};
  height:300px;
  width:50%
  border-color
`;

const UploadLabel = styled.label`
  font-family: 'Raleway', sans-serif;
  font-weight:300;
  font-size:1em;
  color: ${props=>props.theme.color};
  margin-top:10px
`;
const Uploader = styled.input`
  position: absolute;
  top:0;
  left:0;
  height:300px;
  width:100%
  opacity:0
  `;

const errorTheme = {    
  processState:"error",
  color: Red,
  fileIcon:"times-circle",
};

class FileUploader extends Component{
  constructor(props){
    super(props);
    // States : choose-file,uploading,completed,error
    this.state={
      selectedFile:{},
      loaded:-1,
      color: Black,
      uploadText: "Upload your .csr file here",
      processState: "choose-file",
      fileIcon:"file-upload"
    };
    this.onUploadClick = this.onUploadClick.bind(this);
  }
 
  getBtnColor(){
    switch(this.state.processState){
    case "choose-file":
      return {color:LightBlue};
    case "uploading":
      return {color:Yellow};
    case "completed":
      return {color:Green};
    case "error":
      return {color:Red};
    }
  }

  onFileChange(event){
    this.resetState();
    let file = event.target.files[0];
    const csrRegex =/([\d\D]+).csr/gi;
    if (csrRegex.test(file.name)){
      this.setState({
        selectedFile: event.target.files[0],
        uploadText:event.target.files[0].name,
        loaded: 0,
      });
    } else {
      event.target.value = null;
      this.setState({
        ...errorTheme,
        uploadText: "You can only upload .csr files",
      });
    }
  }

  upload(){
    const data = new FormData();
    if(this.state.selectedFile === undefined){
      this.setState({
        ...errorTheme,
        uploadText: "Please select/drag a file here"
      });
      return;
    }

    this.setState({
      processState:"uploading",
      color: Yellow,
      fileIcon:"file-signature",
      uploadText: "Signing..."
    });
    data.append("file", this.state.selectedFile);
    axios.post("http://localhost:8000/upload", data)
      .then(res => { // then print response status
        this.setState({
          processState:"completed",
          color:Green,
          uploadText:"Certificate has been signed, download it below",
          fileIcon:"check-circle",
          certName: res.data.fileName
        });
        console.log(res);
      }).catch((err)=>{
        console.log(err);
        this.setState({
          ...errorTheme,
          uploadText: "Failed to sign cert, please try again",
        });
        document.getElementById("cert-uploader").reset();
        console.log("Cert Failed to be signed.");
      });
  }

  async download(){
    let response = await axios.get(`http://localhost:8000/signed?filename=${this.state.certName}`);
    FileDownload(response.data, "signedCert.crt");
    document.getElementById("cert-uploader").reset();
    this.resetState();
  }

  resetState(){
    this.setState({
      selectedFile: undefined,
      uploadText: "Upload your .csr file here",
      color:Black,
      processState: "choose-file",
      fileIcon:"file-upload"
    });
  }
  
  onUploadClick(){
    switch(this.state.processState){
    case "choose-file":
      this.upload();
      break;
    case "completed":
      this.download();
      break;
    case "error":
      this.resetState();
      break;
    default:
    }
  }

  render(){
    return (
      <UploaderForm method="post" action="#" id="cert-uploader">
        <UploaderContainer theme={{color:this.state.color}}>
          <FontAwesomeIcon icon={this.state.fileIcon} size="2x" color={this.state.color}/>
          <UploadLabel className="uploadText" theme={{color:this.state.color}}>{this.state.uploadText}</UploadLabel>
          <Uploader type="file" name="file" onChange={this.onFileChange.bind(this)} />
        </UploaderContainer>
        <UploadButton  uploadHandler={this.onUploadClick} processState={this.state.processState} color={this.getBtnColor()}/>
      </UploaderForm>
    );
  }
}

export default FileUploader;