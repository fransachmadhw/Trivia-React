import React from 'react'
import { unEscape } from "../utility"

export default function Answer(props) {
  let styles;
  if (props.isChecked) {
    if (props.isCorrect) {
      //green
      styles = {
        backgroundColor: "#94D7A2",
      };
    } else {
      if (props.isHeld) {
        //red
        styles = {
          backgroundColor: "#F8BCBC",
        };
      }
    }
  } else {
    styles = {
      backgroundColor: props.isHeld ? "#682ab9" : "white",
      color: props.isHeld && "white"
    };
  }

  return (
    <div className='answer-container'>
      <button className='answer' style={styles} onClick={props.clickHandler}>
        {props.value}
      </button>
    </div>
  );
}
