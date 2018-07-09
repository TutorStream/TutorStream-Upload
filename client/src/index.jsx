import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleFileSelect(e) {
    this.setState({
      selectedFile: e.target.files
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.selectedFile[0]);
    axios.post('/photo-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => console.log('SUCCESSFUL UPLOADING: ', response))
      .catch((error) => console.error('There was an error with the POST request to the server: ', error));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type='file' onChange={this.handleFileSelect} />
        <button type='submit'>Upload</button>
      </form>
    )
  }
}

render(<FileUpload />, document.getElementById('app'));
export default FileUpload;