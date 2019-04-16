import React, { Component } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UploadBtn = styled.button`
  margin:20px;
  border: none;
  border-radius:20px;
  height: 50px
  width:50%;
  background-color: ${props => props.theme.color};
  font-size:1.5em
  font-family: 'Raleway', sans-serif;
  font-weight:700;
  color:white;
  text-align: center;
  :focus{
    outline: 0;
  }
  :active{
    background-color: #e84118;
  }
  svg{
    padding: 0px 10px
  }
`;

class UploadButton extends Component{

  renderButtonText(state){
    switch(state){
    case "choose-file":
      return (
        <React.Fragment>
          <FontAwesomeIcon icon="file-signature"/>
          Sign
        </React.Fragment>);
    case "signing":
      return (
        <React.Fragment>
          <FontAwesomeIcon icon="spinner" spin />;
          Signing...
        </React.Fragment>);
    case "completed":
      return (
        <React.Fragment>
          <FontAwesomeIcon icon="download"/>
          Sign
        </React.Fragment>);
    case "error":
      return (
        <React.Fragment>
          <FontAwesomeIcon icon="times"/>
          Error
        </React.Fragment>);
    default:
      return (
        <React.Fragment>
          <FontAwesomeIcon icon="file-signature"/>
          Sign
        </React.Fragment>);
    } 
  }


  render(){
    return(
      <UploadBtn type="button" onClick={this.props.uploadHandler} theme={this.props.color}>
        {this.renderButtonText(this.props.processState)}
      </UploadBtn>
    );
  }
}

export default UploadButton;