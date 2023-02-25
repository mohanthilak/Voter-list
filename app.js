const express = require('express');
const app = express();
const cors = require('cors');
const multer = require("multer");
const upload = multer({dest: 'lib/images/'})
const {ConvertImage} = require("./verify.js")
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1EVld2DtuPgkl58XzrZtt3FcP0WsuEPrXKRYxdKWhRoU');
// const {google} = require("googleapis")

// const auth = new google.auth.GoogleAuth({
//     keyFile: "credentials.json",
//     scopes: "https://www.googleapis.com/auth/spreadsheets",
// })
// const spreadsheetID = "1EVld2DtuPgkl58XzrZtt3FcP0WsuEPrXKRYxdKWhRoU"
// let client;
// async function getGoogleClient() {
//     client = await auth.getClient();
//     const googleSheets = google.sheets({version: 'v4', auth: client})
//     return googleSheets;
// }
// const sheet =  getGoogleClient();

async function GetSheet(){
    await doc.useServiceAccountAuth({
        client_email: "admin-70@election-voter-sheet.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCojm3OVdRV8saZ\nyAJqJErKSUr63EQlSNrkHOoC7jmZI/I9V0lknVrMvFPyspJQ1lPILXjrKK0tgGYD\nLwBIwsQxhjPT8YeNkexyfsXf241gTgu68WiwpQQRyuIvcQ1pNtZqZGse/jM8SDl6\nOuQFjtFEy+hpk24TpARucBXeZOc08cIieKlVTuHJKgKB6pKZ+F+6k2QcCrVvaAG+\nOpbQrEfMoSEDj9ZlkPojneh+WDm1pFiZBwPYBzJ4o52BuqsgkTBd+dwx+ycmZlJn\nmdJNkTlSupUktnbRiQIqxV4HZVNb12jYjXZLozEzpRHOGDn+spDJu/IgnZAxziBi\nrkASAFk/AgMBAAECggEAE5wSYU1x+RfYDB8NTNzxCIyzWPEUSoQp1x0YCoQ9ljfs\n4D8N7lMyM5x7ZcJprFbrA2Bq72zZjPAhriAjN9PU8HANCozQeONvrzhZe/w2e+xI\niBS62cYw7YL9goh0B3gWROVu4vmu60X5zeMZER528TqJzPKWfVl5HIIUwT1a+rkv\nInPMcXeR42krQ8TCPqPjSFT4lSdforI0IjeF7Z/m9zmp0STLS93tJKI550PjF2Ty\nTHcmFCgsT6PxReOKs7rHaIcaB8f7RXz26wQDSgOAhtJiKvKe4//vKyIQmYcmw1FZ\ni++/Meb5FBg11gpUfMK2qJMbQcrePL+Nau8RVVH+9QKBgQDgfR5GIxHi3icynuR8\na9aH7HzuEJuaVITMbnwMpaI8VgWzjwyqiOhGnLdSz0euEPtjCSAvyFbYtJhxeK4K\nAc5jaumHR6l3kmufm3mMPjAD45ZKComds2qhRSZW2LU5SYt4IiIQG0eSan5LL2iZ\nwFBAnfRZfV1sCPVWwrd+F80G9QKBgQDAN2kqF2TSXQQqfmEG1uFuGbnT74iqDWmE\nkfwDMBCFm8EurK5nBHSxFzbyknK59/XxRHECQGYusa+UZSeJl1DsTJO2aDY4DHEk\nDL7PJl6WpHrvv2je3zQDN719jSU9F51Ziz9tUZv4IQ95+WtmDbEvk2t4LFH8YomT\niNBSMJ224wKBgDtmP+V1EB2EhMCrNHALpLdQhvoDIPkkFgN11JMQHK50YIvTdRmG\noldUzlk2CZRwX+QjnQWnr/slRhT4RqzVL4Q03NfzyU6fSqTv4aiPJ+tPhAvRX/p/\nZ96GSo++Ra2D3UiLV5IFddmzHfnM8JOGRHXklaw8NMUKVciAO0c9Cv4lAoGBAI/s\n7aHGwoeBfo0S9DPa0hFO0gYPZZVvVYMejEUWyEhCx/Pa+PvKKlYvu8UGQ0FcmZt+\nU+ALuHdeNMo4s9Iiq0VEUZZTkcWGC3Gi2XzijhDeN+8ss6muF5QROKG5/hgwhnF2\nApgoc1Dn8F60k+ZmejXVfLMO/JSuc7U0zEe+f1lhAoGAZXwJXsXimizrysTpUJbV\nozJSMzp/Ct5oz4h7LmGaJx9h9kBQxEuvUkngb0uhoTi6SgfoPZDhc40vDvK0SRGn\nyaAW2B1IWUuoHYPdFWZr8m3JNCrCWd+msF617/8Bb/LNxYL5L7vDh93G64s9wqjp\n3Y+2ka2eTHm5JgJN/Nfob8s=\n-----END PRIVATE KEY-----\n",
      });
      
      await doc.loadInfo(); // loads document properties and worksheets
      console.log(doc.title);
      await doc.updateProperties({ title: 'renamed doc' });
      
      const sheet = doc.sheetsByIndex[0]
      return sheet;
}


app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors({
//     origin: ['http://localhost:3000'],
//     methods: ['GET', 'POST'],
//     credentials: true,
// }));

app.use("/", (req, res, next)=>{
    console.log(req.url);
    next()
})


app.get('/', async (req, res)=>{
    try{
        console.log("fads")
        const sheet = await GetSheet();
        const row = await sheet.addRows([{RollNo: 1, Name: "jo"}, {RollNo:2, Name: "Mo"}])
        const rows = await sheet.getRows();
        console.log(rows[0]);
        return res.status(200).send("list");
    }catch(e){
        console.log("Error while generating list", e);
        return res.status(500).send("server error",e)
    }

})


app.post("/add-single", async(req, res)=>{
    try{
        const {voter} = req.body;
        const sheet = await GetSheet();
        const row = await sheet.addRow(voter);
        return res.send("uploaded")    
    }catch(e){
        console.log("error while uploading a single voter", e);
        return res.status(500).send("server-error", e);
    }
})

app.post('/confirm-list', async(req,res)=>{
    try{
        const {address, constituency, addressLink, list } = req.body;
        const newlist = list.map(obj=>({...obj, address, constituency, addressLink}));
        const sheet = await GetSheet();
        const rows = await sheet.addRows(newlist)
        res.send("success")
    }catch(e){
        console.log("Error while uploading list", e);
        return res.status(500).send("server error", e);
    }

})

app.post('/upload-list', upload.single("list"), async(req, res) =>{
    // console.log(ConvertImage);
    try{
    const list = await ConvertImage(req.file.path);
    console.log("@!@!@!@!#$#$#$#$#$", list)
    return res.status(200).json({success: true, message: "List Generated", data: list})
    }catch(e){
        console.log("Error while generating list", e);
        res.status(500).json({success: true, message: e, data: null});
    }
});



app.listen(4000, ()=>console.log(`listening at port ${4000}`))