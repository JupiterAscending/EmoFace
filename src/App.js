import "./App.scss";
import React, { useState, useRef, Fragment, useEffect } from "react";
import Room from "./Room";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { database } from "./firebase";

import Prompt from "./components/Prompt";
import Video from "./components/Video";
const { connect } = require("twilio-video");

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "gray",
  },
  main: {
    margin: theme.spacing(2, 10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  prompt: {
    width: "100%", // Fix IE 11 issue.
    height: "15%",
    marginTop: theme.spacing(1),
  },
}));

export default function App() {
  const [identity, setIdentity] = useState("");
  const [room, setRoom] = useState(null);
  const [roomName, setRoomName] = useState("");
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(() => {
    database.test.get().then((snapshot) => {
      // console.log(snapshot);
      snapshot.docs.map((s) => console.log(s.data()));
    });

    // database.test((snapshot))
  }, []);

  // console.log({ identity, room, roomName });

  async function joinRoom() {
    try {
      const response = await fetch(
        `https://video-sample-jp-3971-dev.twil.io/video-token`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            identity: identity,
            room_name: roomName,
          }),
        }
      );
      const data = await response.json();
      console.log(`token: ${data.accessToken}`);
      console.log(`room: ${data.room}`);
      // console.log(`roomSid: ${roomSid}`);
      const room = await connect(data.accessToken, {
        room: data.room,
        audio: true,
        video: true,
      });
      console.log("this is rooom ----------", room);
      //   const room = data.room;
      setRoom(room);

      database.scores
        .doc(roomName)
        .set(
          {
            [identity]: 0,
            finished: false,
          },
          { merge: true }
        )
        .then(() => {
          console.log("insertion successful");
        });
    } catch (err) {
      console.log(err);
    }
  }
  function returnToLobby() {
    setRoom(null);
  }

  function removePlaceholderText() {
    inputRef.current.placeholder = "";
  }
  function updateIdentity(event) {
    setIdentity(event.target.value);
  }
  function updateRoomName(e) {
    // console.log(e.target.value);
    setRoomName(e.target.value);
  }
  const disabled = identity === "" ? true : false;

  return (
    <Fragment>
      <div className="app">
        {room === null ? (
          <div className="lobby">
            <div>
              <input placeholder="room name" onChange={updateRoomName} />
            </div>
            <input
              placeholder="What's your name?"
              ref={inputRef}
              value={identity}
              onChange={updateIdentity}
              onClick={removePlaceholderText}
            />
            <button onClick={joinRoom}>Join Room</button>
          </div>
        ) : (
          <Room returnToLobby={returnToLobby} room={room} />
        )}
      </div>
      <Hidden smDown implementation="css">
        <Grid container component="main" className={classes.root} justify="center">
          <div
            style={{
              display: "flex",
              margin: 40,
              // marginTop: 40,
              // marginBottom: 40,
              background: "white",
            }}
          >
            <Grid>
              <Prompt></Prompt>
              {/* <Video></Video> */}
              <div className={classes.main}>
                <Container maxWidth="sm">
                  <Button variant="contained" color="secondary">
                    Start
                  </Button>
                </Container>
              </div>
            </Grid>
          </div>
        </Grid>
      </Hidden>
      <Hidden smUp implementation="css">
        <Grid container component="main" className={classes.root} justify="center">
          <div
            style={{
              display: "flex",
              margin: 40,
              background: "white",
            }}
          >
            <Grid>
              <Prompt></Prompt>
              {/* <Video> */}

              {/* </Video> */}
              <div className={classes.main}>
                <Container maxWidth="sm">
                  <Button variant="contained" color="secondary">
                    Start
                  </Button>
                </Container>
              </div>
            </Grid>
          </div>
        </Grid>
      </Hidden>
    </Fragment>
  );
}
