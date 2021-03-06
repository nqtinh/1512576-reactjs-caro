
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const size = 3;
const nSquareToWin = 3;

function Square(props) {
  return (props.win) ? (
    <button className="square square-highlight" onClick={props.onClick}>
      {props.value}
    </button>
  ) : (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>  
  )  ;
}

class SquareRow extends React.Component {
  render() {
    let squareRow = this.props.row.map((square, idx) => {
      let k = "s" + idx;
      let win = false;
      let winner = this.props.winner;
      let rowidd = this.props.rowidd;
      if (winner) 
      {
        if (winner.direction === "Right" &&idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && rowidd === winner.y) {win = true;}
        if (winner.direction === "Down" &&rowidd >= winner.y && rowidd <= winner.y + nSquareToWin - 1 && idx === winner.x) {win = true;}
        if (winner.direction === "RightDown" &&idx >= winner.x && idx <= winner.x + nSquareToWin - 1 && idx - winner.x === rowidd - winner.y) {win = true;}
        if (winner.direction === "LeftDown" &&idx <= winner.x && idx >= winner.x - nSquareToWin + 1 && winner.x - idx === rowidd - winner.y) {win = true;}
      }
      return (
        <Square win={win} value={square} onClick={() => this.props.onClick(this.props.rowidd, idx)} key={k} />
      )
    })
    return (
      <div className="board-row">
        {squareRow}
      </div>
    )
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let board;
    board = this.props.squares.map((row, idx) => {
      let k = "r" + idx;
      return (
        <SquareRow winner={this.props.winner} rowidd={idx} row={row} onClick={this.props.onClick} key={k}/>
      )
    })
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let tmpArr = Array(size);
    for (let i = 0; i < size; i++) {
      tmpArr[i] = Array(size).fill(null);
    }
    this.state = {
      history: [{
        squares: tmpArr,
        location: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isDescending: true,
    };this.sort = this.sort.bind(this);
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    current.squares.map((row, idx) => {
      squares[idx] = current.squares[idx].slice();
      return true;
    })
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: {x: i, y: j}
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  sort() {this.setState({isDescending: !this.state.isDescending});}

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var stepp;
    let moves = history.map((step, move) => {
      
      const desc = move ?
        'Go to move #' + move + ' (' + step.location.x + ',' + step.location.y + ')' :
        'Go to game start';
        stepp=move;
      return (this.state.stepNumber === move) ? (
        <li key={move}>
          <button className="btn-bold" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      ) : (
        <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
      );
    });
    if (!this.state.isDescending) {moves = moves.reverse();}
    console.log(stepp);
    let status;
    if (winner) {
      status = 'Winner: ' + winner.val;
    }
    if(winner!==true) {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    if(winner!==true && stepp===9){
      console.log(stepp);
      status = 'Nobody win';
      alert("Nobody win");
    }

    return (
      <div className="game">
        <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i, j) => this.handleClick(i, j)}
              winner={winner}
          />
        </div>
        <div className="game-info">
            <div>
              <button onClick={this.sort}>Đổi thứ tự</button>
            </div>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {let win;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < squares[i].length; j++) {
      if (!squares[i][j]) continue;
      if (j <= squares[i].length - nSquareToWin) {win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i][j + k] !== squares[i][j + k + 1]) {win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'Right'};
      }
      if (i <= squares.length - nSquareToWin) {win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j] !== squares[i + k + 1][j]) {win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'Down'};
      }
      if (j <= squares[i].length - nSquareToWin && i <= squares.length - nSquareToWin) {win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) { win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'RightDown'};
      }
      if (i <= squares.length - nSquareToWin && j >= nSquareToWin - 1) {win = true;
        for (let k = 0; k < nSquareToWin - 1; k++) {
          if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {win = false
          }
        }
        if (win) return {val: squares[i][j], x: j, y: i, direction: 'LeftDown'};
      }
    }
  }
  return null;
}

