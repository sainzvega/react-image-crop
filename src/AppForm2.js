import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import styled from 'styled-components';
import loadImage from 'blueimp-load-image';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import 'react-image-crop/dist/ReactCrop.css';

// **NOTE: This uses react-cropper
const ImageContainer = styled.div`
  max-height: 400px;
  height: 400px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  overflow-y: auto;
  background-color: #efefef;
  & > img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    // width: 100%;
  }
`;

const defaultMessageObj = {
  showMessage: false,
  message: '',
  level: ''
};

const AppForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileState, setFileState] = useState({
    file: '',
    imagePreviewURL: ''
  });
  const [messageObj, setMessageObj] = useState(defaultMessageObj);

  function dismissMessage() {
    setMessageObj(defaultMessageObj);
  }

  function handleFileChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      loadImage(
        file,
        img => {
          setFileState({
            file: file,
            imagePreviewURL: img.toDataURL()
          });
          setLoading(false);
        },
        { orientation: true }
      );
    }
  }

  async function handleUploadImage(e) {
    e.preventDefault();
    setMessageObj(defaultMessageObj);
    if (!fileState.file || !fileState.imagePreviewURL) {
      return setMessageObj({
        showMessage: true,
        message: 'Please select an image.',
        level: 'danger'
      });
    }

    try {
      const formData = new FormData();
      formData.append('file', fileState.file);

      const { data } = await axios.post('http://localhost:8000/upload', formData);
      const { status, message } = data;
      return setMessageObj({
        showMessage: true,
        message: message,
        level: status === 'success' ? 'success' : 'danger'
      });
    } catch {
      return setMessageObj({
        showMessage: true,
        message: 'We experienced an error.  Please try again.',
        level: 'danger'
      });
    }
  }

  const { showMessage, message, level } = messageObj;
  const { imagePreviewURL } = fileState;
  return (
    <Form onSubmit={handleUploadImage}>
      {showMessage && (
        <Alert color={level}>
          {message}
          <button type="button" className="close" onClick={dismissMessage}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Alert>
      )}
      <ImageContainer>
        {loading && <div>Loading....</div>}
        {!loading && imagePreviewURL && (
          <ReactCrop src={imagePreviewURL} />
          //   <img
          //     onLoad={() => setLoading(false)}
          //     onError={() => {
          //       setLoading(false);
          //       setMessageObj({
          //         showMessage: true,
          //         message: 'Could not load image',
          //         level: 'error'
          //       });
          //     }}
          //     src={imagePreviewURL}
          //     title="user avatar"
          //     alt="user avatar"
          //   />
        )}
      </ImageContainer>
      <FormGroup>
        <Label for="exampleFile">Image</Label>
        <Input
          id="avatar-upload"
          type="file"
          name="avatar"
          onChange={handleFileChange}
          accept="image/*"
        />
        <FormText color="muted">Upload an image</FormText>
      </FormGroup>
      <Button>Upload Image</Button>
    </Form>
  );
};

export default AppForm;
