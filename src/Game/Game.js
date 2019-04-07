import React, { Component } from 'react';
import Board from "./Board"

class Game extends Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ], 
        stepNumber: 0,
        o : 'O',
        x : 'X',
        vsComp : false,
        playerX: true,
        winningLines: [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ]
      };
    }
    calculateWinner = (squares) => {
      for (let i = 0; i < this.state.winningLines.length; i++) {
        const [a, b, c] = this.state.winningLines[i]; 
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return null;
    }

    compPlay = (squares,playerX ) => {
      //close user possible win, select best option to win
      let toplay = playerX ? this.state.x : this.state.o;

      for (let i = 0; i < this.state.winningLines.length; i++) {
        const [a, b, c] = this.state.winningLines[i]; 
        if (squares[a] && squares[a] === squares[b] && !squares[c]) {
          squares[c] = toplay;
          return squares
        }
        if (squares[a] && squares[a] === squares[c] && !squares[b]) {
          squares[b] = toplay;
          return squares
        }
        if (squares[b] && squares[b] === squares[c] && !squares[a]) {
          squares[a] = toplay;
          return squares
        }
      }
      for (let i = 0; i < this.state.winningLines.length; i++) {
        const [a, b, c] = this.state.winningLines[i]; 
        if(squares[a] && !squares[b]){
          squares[b] = toplay;
          return squares
        }
        if(squares[b] && !squares[c]){
          squares[c] = toplay;
          return squares
        }
        if(squares[c] && !squares[b]){
          squares[b] = toplay;
          return squares
        }
      }
      return squares
    }
    
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      let squares = current.squares.slice();
      let playerX = this.state.playerX;

      if (this.calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = (playerX)? this.state.x : this.state.o;
      playerX = !playerX;

      if (!this.calculateWinner(squares) && this.state.vsComp){
        squares = this.compPlay(squares,playerX );
        playerX = !playerX;
      }

      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        playerX: playerX
      });
    }
    selectPlayer(){
      this.setState({
        vsComp : !this.state.vsComp
      })
    }
    getVs(){
      return this.state.vsComp ? "vs Computer": "vs Player O";
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        playerX: (step % 2) === 0
      });
    }
    getStatus = () => {
      const winner = this.getWinner().winner;
      let status;
      if(winner === "draw"){
        status = "draw";
      }else if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Player " + (this.state.playerX ? "X" : "O");
      }
      return status;
    }
    getWinner = () => {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      let winner = this.calculateWinner(current.squares);
      winner = (!winner && current.squares.findIndex(a => a === null) === -1)? "draw" : winner;
      return {
        winner : winner,
        squares : current.squares
      };
    }
    getMoves = () => {
      const history = this.state.history;
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      return moves;
    }
    getStatusClass = ()=>{
      return (this.getWinner().winner)? "success": "";
    }
    render() {     
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.getWinner().squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="">
              <div className = "vs-view" onClick={() => this.selectPlayer()}>
                player X {this.getVs()}
              </div> 
              <br/>
              <div className={this.getStatusClass()}>{this.getStatus()}</div>              
            </div>            
            <ol>{this.getMoves()}</ol>
          </div>
        </div>
      );
    }
  }

  export default Game;