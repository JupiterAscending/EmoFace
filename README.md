<h1 align="center">EmoFace</h1>

<p align="center">*This repository was created during our time as students at Code Chrysalis.</p><br>

## 1. About

This is a web app for playing through video calls with distant family and friends.

## 2. Usage

This web app is intended to be used on smartphones. EmoFace doesn't require any account registration if you just want to join.

<p align="center"><img src="public/EmoFace.png" width="200px"></p>

Once you have accessed the app, set the name of the room you want to video call and your handle respectively, and click the "Join Room" button.
Then, when the person you want to video call joins the room you are in, click the "Set" button on the screen. Now you're ready to play together.

This app allows you to make facial expressions based on the subject displayed on the screen, and compete for points for those expressions.

When the two of you are in the room, first press the "Set" button. By doing so, you can prepare for the game.
When you press the "Set" button, the subject will appear on the screen. Then, make a facial expression of that theme. When you have changed your expression, press the "Capture Me" button. Did you get a capture of your face? Then press the "Analyze Me" button, and the score of your expression will be displayed. Now you can compete with each other's facial expressions.

Still not playing enough?
If so, press the "Set" button again. Then press the "Set" button again, and the next subject will be displayed. The rest of the procedure is the same. After playing, you can leave the room by pressing "Leave Room".

## 3. How it works

The way the application works is as follows.

<p align="center"><img src="public/Twilio-Video.png" width="70%"></p>

The video feature of this web app takes advantage of the Twilio Programmable Video feature. Capturing from a video is done by depicting the current video state on an HTML5 canvas, as if it were a capture from a video. For the facial expression scoring function, we use the Face API provided by Microsoft to analyze the captured face.

## 4. Technology used

This software was built with the following technologies.

<p align="center"><img src="public/technology.png" width="70%"></p>

## 5. Future features

## 6. Authors

Co-authors of this application

- Miho Ogura
- Yuriko Hijikata
- Naoyuki Hayasaka

## 7. Finally

Finally, I would like to express my sincere respect to Mr. Daizen Ikehara for providing the twilio api.
Thank you very much!
