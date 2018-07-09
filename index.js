const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname, './client/dist')));
app.use(cors());

//S3 keys
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccesKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

//configure AWS to be able to use promises
AWS.config.setPromisesDependency(bluebird);

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

//file post route
app.post('/photo-upload', (request, response) => {
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) {
      console.error('There was an error with parsing the form to upload the file: ', error);
    }
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `tsProfile-${timestamp}`;
      const data = await uploadFile(buffer, fileName, type);
      return response.status(201).send(data);
    } catch (error) {
      return response.status(400).send(error);
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`EC2 Magic happens on port ${port}!`);
});
