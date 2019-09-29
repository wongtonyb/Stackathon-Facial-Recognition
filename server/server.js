const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const loc = 'https://westcentralus.api.cognitive.microsoft.com/'; // replace with the server nearest to you
const key = '97ca6854b01a4c668929ac6285be746b';
const facelist_id = 'class-3e-facelist'; // the ID of the face list we'll be working with

const base_instance_options = {
  baseURL: `https://${loc}/face/v1.0`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': key,
  },
};

// app.get('/create-facelist', async (req, res) => {
//   try {
//     const instance = { ...base_instance_options };
//     const facelist_id = 'CaptainAmerica';
//     const response = await instance.put(`/facelists/${facelist_id}`, {
//       name: 'Captain America',
//     });

//     console.log('created facelist: ', response.data);
//     res.send('ok');
//   } catch (err) {
//     console.log('error creating facelist: ', err);
//     res.send('not ok');
//   }
// });

app.post('https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect');
