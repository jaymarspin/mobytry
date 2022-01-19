const testFolder = './www/';
const fs = require('fs');
const request = require('request');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fs.readdir(testFolder, (err, files) => {
  files.forEach((file) => { 
    const tmp = file.substring(file.lastIndexOf('.') + 1);
    
    if (tmp === 'js') {
      const data  = fs.readFileSync(testFolder+file,'utf-8')
      // const tmp2 = data.substring(data.lastIndexOf('sourceMappingURL=') + 15)
      const tmp2 = data.split("sourceMappingURL=")

//       const url = `curl https://api.rollbar.com/api/1/sourcemap \
// -F access_token=2dde7f85f6fe494fb5aafe3db480f531 \
// -F minified_url=./www/${file} \
// -F source_map=@./www/${tmp2[1]}`;
// console.log(url)

// fetch(url)
//     .then(response => {
//         console.log(response)
//     })
//     .catch(error => {
      
//         console.log(err)
//     })

request({
  url: 'https://api.rollbar.com/api/1/sourcemap',
  headers: {
    'content-type': 'multipart/form-data'
  },
  method: 'POST',
  multipart: [
    // Field name goes in the "name" part of the Content-Disposition
    // Value goes in the body
    {
      'Content-Disposition': 'form-data; name="access_token"',
      body: '75082c4c2c444f6199e80e4f09e69633'
    },
    {
      'Content-Disposition': 'form-data; name="version"',
      body: '3'
    },
    {
      'Content-Disposition': 'form-data; name="minified_url"',
      body: "./www/${file}"
    },
    {
      'Content-Disposition': `form-data; name="source_map"; filename="./www/${tmp2[1]}"`,
      body: fs.readFileSync(`./www/${tmp2[1]}`)
    }
    // below is optional - use to upload original source files
    /*
    , {
      'Content-Disposition': 'form-data; name="static/js/site.js"; filename="site.js"',
      body: fs.readFileSync('./static/js/site.js')
    }
    */
  ]
}, function(err, response, body) {
  if (err) {
    return console.error("Upload failed:", err);
  }
  if (response.statusCode !== 200) {
    console.error("Upload failed. Got status code ", response.statusCode);
    console.error(body);
  } else {
    console.log("Upload succeeded.");
    console.log(body);
  }
});
    }
    
  });
});
