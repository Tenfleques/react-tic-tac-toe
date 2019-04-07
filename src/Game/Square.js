import React, { Component } from 'react';
import './game.css';

const Square = (props) => {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );    
}
export default Square
  
  