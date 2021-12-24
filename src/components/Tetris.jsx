import React, { useState } from 'react';
import Display from './Display';
import Stage from './Stage';
import StartButton from './StartButton';
import { createStage } from '../gameHelper';

// styled components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';


const Tetris = () => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer] = usePlayer();
    const [stage, setStage] = useStage(player);

    console.log('Re-render');

    const startGame = () => {

        // Reset Everything
        setStage(createStage());
        resetPlayer();

    }

    const move = ({ keyCode }) => {

        if(!gameOver) {
            // 3 Directions are possible for this game
            if(keyCode === 37) { // Move Left
                movePlayer(-1);
            }
            else if(keyCode === 39) { // Move Right
                movePlayer(1);
            }
            else if(keyCode === 40) { // Move Down
                dropPlayer();
            }
        }

    }

    const movePlayer = dir => {
        updatePlayerPos({ x: dir, y: 0 });
    }

    const drop = () => {
        updatePlayerPos({ x: 0, y: 1, collided: false });
    }

    const dropPlayer = () => {
        drop();
    }

    return (
        <StyledTetrisWrapper role='button' tabIndex='0' onKeyDown={e => move(e)} >
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text='Game Over' />
                    ) : (
                        <div>
                            <Display text="Score" />
                            <Display text="Row" />
                            <Display text="Level" />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper> 
    )
} 

export default Tetris
