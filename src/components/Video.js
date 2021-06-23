/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  prompt: {
    width: "100%", // Fix IE 11 issue.
    height: "50%",
    marginTop: theme.spacing(1)
  }
}));

const Video = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.prompt} style={{ backgroundColor: "black" }}>
        {/* <Container maxWidth="sm" style={{ backgroundColor: "black" }}>
          <div>hello</div>
        </Container> */}
      </div>
    </Fragment>
  );
};

export default Video;
