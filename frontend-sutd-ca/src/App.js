import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";
import {FileUploader} from "./components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileUpload,faFileSignature, faSpinner, faTimes, faDownload,faCheckCircle,faTimesCircle} from "@fortawesome/free-solid-svg-icons";

library.add([faFileUpload,faFileSignature,faSpinner, faTimes, faDownload, faCheckCircle, faTimesCircle]);

const TitleContainer= styled.div`
  grid-area: header;
  font-family: 'Raleway', sans-serif;

  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items:center;
  text-align: center
  .title{
    font-weight:900;
    font-size: 3em;
    margin: 0px 5px
  }
  .subtitle{
    font-size:1.5em
    font-weight:700;
    color: #576574;
    margin: 0px 5px;
  }

`;
const Container = styled.div`
  display:grid;
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  grid-template: 50px 100px 1fr / 1fr 80% 1fr;
  grid-template-areas:
  "l-pad c-pad r-pad"
  "l-pad header r-pad"
  "l-pad upload-area r-pad"
`;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    };

  }

  render() {
    return (
      <Container>
        <TitleContainer>
          <h1 className="title">CSE CENTRAL</h1>
          <p className="subtitle">A SUTD Certificate Authority</p>
        </TitleContainer>
        <FileUploader></FileUploader>
      </Container>
    );
  }
}

export default App;
