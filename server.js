require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const twilio = require("twilio");
// const AccessToken = require('twilio').jwt.AccessToken;

app.use(cors());
app.use(express.json());

app.use(express.static("build"));

const port = process.env.PORT || 5000;

// app.post("/video-token", (req, res)=>{
//     const {identity, room} = req.body;
//     console.log({identity, room})
//     const AccessToken = twilio.jwt.AccessToken;

//     const VideoGrant = AccessToken.VideoGrant;
//     const token = new AccessToken(
//         process.env.TWILIO_ACCOUNT_SID,
//         process.env.TWILIO_API_KEY,
//         process.env.TWILIO_API_SECRET
//       );
//     token.identity = identity;
//     const grant = new VideoGrant();
//       grant.room = room;
//       token.addGrant(grant);

//       return token.toJwt()

// })

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
