// **NOTE: This uses react-cropper
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import loadImage from 'blueimp-load-image';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

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
  const [cropState, setCropState] = useState({ left: 0, top: 0, height: 300, width: 300 });
  const [messageObj, setMessageObj] = useState(defaultMessageObj);
  const cropper = useRef(null);

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
      formData.append('cropleft', cropState.left);
      formData.append('croptop', cropState.top);
      formData.append('cropheight', cropState.height);
      formData.append('cropwidth', cropState.width);

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

  function handleCrop(e) {
    if (cropper.current) {
      const { left, top, height, width } = cropper.current.cropper.cropBoxData;
      console.log('cropper: ', { left, top, height, width });
      setCropState({ left, top, height, width });
    } else {
      console.log('Croper not found');
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
          <Cropper
            ref={cropper}
            src={imagePreviewURL}
            crop={handleCrop}
            style={{ height: '100%', width: '100%' }}
            viewMode={0}
            aspectRatio={1 / 1}
            center={true}
            guides={true}
            rotatable={false}
            zoomable={true}
            minCropBoxHeight={300}
            minCropBoxWidth={300}
          />
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
