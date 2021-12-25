import React, { useState } from 'react';
import Display from './Display';
import Stage from './Stage';
import StartButton from './StartButton';
import { createStage, checkCollision } from '../gameHelper';

// styled components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';


const Tetris = () => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage] = useStage(player, resetPlayer);

    console.log('Re-render');

    const movePlayer = dir => {
        if(!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {

        // Reset Everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);

    }

    const drop = () => {
        if(!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        }
        else {
            // Game Over
            if(player.pos.y < 1) {
                console.log('Game Over');
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 40) {
                console.log('Interval Off');
                setDropTime(1000);
            }
        }
    }

    const dropPlayer = () => {
        console.log('Interval Off');
        setDropTime(null);
        drop();
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
            else if(keyCode === 38) { // Up Arrow Key will rotate the block
                playerRotate(stage, 1);
            }
        }

    }

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper 
            role='button' 
            tabIndex='0' 
            onKeyDown={e => move(e)} 
            onKeyUp={keyUp} 
        >
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
