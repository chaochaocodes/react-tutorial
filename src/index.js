import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
        return(
            <button 
                className="square" 
                // Since the Board passed onClick={() => this.handleClick(i)} to Square, 
                // the Square calls this.handleClick(i) when clicked.
                onClick={props.onClick}
                >
                {props.value}
            </button>
        );
}

class Board extends React.Component {
    state = {
        // Array of 9 nulls corresponding to 9 squares
        squares: Array(9).fill(null),
        xIsNext: true,
    }

    handleClick(i) {
        // create a copy of the squares array to modify instead of modifying the existing array
        // why? immutability! 
        // 1. Avoiding direct data mutation lets us Cmd-Z, Cmd-Y (keep previous versions to reuse!)
        // 2. Helps you build pure components for optimizing performance
        // Immutable data can easily determine if changes have been made, to determine when a component requires re-rendering.
        const squares = this.state.squares.slice();
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        })
    }

    renderSquare(i) {
        return (
            <Square 
            // maintains which squares are filled
            value={this.state.squares[i]} 
            onClick={() => this.handleClick(i)}
        />);
    }
    
    render() {
        const status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
        return(
            <>
                <div className="status">{status}</div>
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
    render(){
        return(
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div> {/* status */} </div>
                    <ol>{/* TODO  */}</ol>
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
