import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
function InfoBox({ title, cases, isRed, isGrey, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--Red"
      } ${isGrey && "infoBox--Grey"}`}
    >
      <CardContent style={{ backgroundColor: "#ffffff" }}>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${
            isGrey && "infoBox__cases--grey"
          }`}
        >
          {cases}
        </h2>
        {/* 1.2M Total */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;