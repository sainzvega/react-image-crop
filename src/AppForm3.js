// **NOTE: This uses react-avatar-editor
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import loadImage from 'blueimp-load-image';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import AvatarEditor from 'react-avatar-editor';

const ImageContainer = styled.div`
  max-height: 400px;
  height: 400px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  overflow: none;
  background-color: #efefef;
`;

const defaultMessageObj = {
  showMessage: false,
  message: '',
  level: ''
};

const AppForm3 = () => {
  const [loading, setLoading] = useState(false);
  const [fileState, setFileState] = useState({
    file: '',
    imagePreviewURL: ''
  });
  const [scale, setScale] = useState(1);
  const [resizePreviewURL, setResizePreviewURL] = useState('');
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
      const cropDetails = getCroppingRect();
      console.log(cropDetails);
      const formData = new FormData();
      formData.append('file', fileState.file);
      formData.append('cropleft', cropDetails.x);
      formData.append('croptop', cropDetails.y);
      formData.append('cropheight', cropDetails.height);
      formData.append('cropwidth', cropDetails.width);

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

  // ========== Cropper specific details ==========
  function getCroppingRect() {
    if (cropper.current) {
      return cropper.current.getCroppingRect();
    }
  }

  function handleScale(e) {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  }

  function handlePreview() {
    if (cropper.current) {
      setResizePreviewURL(cropper.current.getImage().toDataURL());
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
          <>
            <AvatarEditor
              ref={cropper}
              image={imagePreviewURL}
              width={300}
              height={300}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={scale}
              rotate={0}
            />
            <label>Zoom:</label>
            <input
              name="scale"
              type="range"
              onChange={handleScale}
              min={'1'}
              max="3"
              step="0.01"
              value={scale}
            />
            <button type="button" onClick={handlePreview}>
              Preview
            </button>
          </>
        )}
      </ImageContainer>
      {resizePreviewURL && (
        <img
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setMessageObj({
              showMessage: true,
              message: 'Could not load image',
              level: 'error'
            });
          }}
          src={resizePreviewURL}
          title="user avatar"
          alt="user avatar"          
        />
      )}

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
      <Button type="submit">Upload Image</Button>
    </Form>
  );
};

export default AppForm3;
