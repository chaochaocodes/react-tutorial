import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
        return(
            // Game passed onClick={(i) => this.handleClick(i)} to Board,
            // Board passed onClick={() => this.props.onClick(i)} to Square, 
            // Square calls {props.onClick} when clicked.
            <button className="square" onClick={props.onClick} >
                {props.value}
            </button>
        );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
            // maintains which squares are filled
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />);
    }
    
    render() {
        return(
            <>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>                
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </>
        )
    }
}

class Game extends React.Component {
    state = {
        history: [{
            // Array of 9 nulls corresponding to 9 squares
            squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true,
    }

    handleClick(i) {
        // replace this.state.history with this.state.history.slice(0, this.state.stepNumber + 1). 
        // If we “go back in time” and make a new move from that point, 
        // we throw away all the “future” history that would now become incorrect.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // spice to create a copy of the squares array to modify 
        // why? immutability! 
        // 1. Avoiding direct data mutation lets us Cmd-Z, Cmd-Y (keep previous versions to reuse!)
        // 2. Helps you build pure components for optimizing performance
        // Immutable data can easily determine if changes have been made, to determine when a component requires re-rendering.
        const squares = current.squares.slice();

        // Have the Board’s handleClick function return early by ignoring a click 
        // if someone has won or if a Square is already filled:
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // concat new history onto history on every click
            // concat doesnt mutate array like push()
            history: history.concat ([{ 
                squares: squares,
            }]),
            stepNumber: history.length, // update step after new move
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0
        });
      }

    render(){
        const history = this.state.history; // access array of squares
        const current = history[this.state.stepNumber]; // keeps track of each move
        const winner = calculateWinner(current.squares);

        // map over history of moves to buttons (React elements)
        // display list of buttons to "jump" to past moves
        // ********* Each child in an array/iterator needs a unique "key" prop ******
        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={()=> this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status} </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ===================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')    
);


// Given an array of 9 squares, this function will check for a winner 
// and return 'X', 'O', or null as appropriate.
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }