import React, { Component } from 'react';
import styled from 'styled-components';
import { withAlert } from 'react-alert'

let FileSaver = require('file-saver');

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

class FileCreator extends Component{


    exportJson = e => {
        if(this.props.items.length === 0){
            this.props.alert.show('Code is empty! Cannot compile')
        } else {
            let intermediateCode = "";
            {this.props.items.map((item, index) =>(
                intermediateCode += " " + item.content
            ))}
            //console.log(intermediateCode)
            let blob = new Blob([intermediateCode], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "code.txt");
        }
    }

    render() {

        //console.log(this.props.items)

        return(
            <div>
                <Button style={{
                    marginLeft: "0.5rem",
                    marginTop: "0.5rem"
                }} onClick={this.exportJson}>
                    <ButtonText>Compile code {this.props.type}</ButtonText>
                </Button>
            </div>
        )
    }
}

export default withAlert(FileCreator)
