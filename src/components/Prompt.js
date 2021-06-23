/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
  prompt: {
    width: "80%", // Fix IE 11 issue.
    height: "15%",
    margin: theme.spacing(1, 1, 1, 3.5)
  }
}));

const Prompt = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Card className={classes.prompt} style={{ backgroundColor: "blue" }}>
        Hello
      </Card>
    </Fragment>
  );
};

export default Prompt;
