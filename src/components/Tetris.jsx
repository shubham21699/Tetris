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
import { useGameStatus } from '../hooks/useGameStatus';


const Tetris = () => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    console.log('Re-render');

    const movePlayer = dir => {
        if(!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {

        // Reset Everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setScore(0);
        setRows(0);
        setLevel(0);
        setGameOver(false);

    };

    const drop = () => {

        // Increase level when players have cleared 10 rows.
        if(rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);

            // Also increase the speed.
            setDropTime(1000 / (level + 1) + 200);
        }

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
    };

    const keyUp = ({ keyCode }) => {
        if(!gameOver) {
            if(keyCode === 40) {
                console.log('Interval Off');
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        console.log('Interval Off');
        setDropTime(null);
        drop();
    };

    useInterval(() => {
        drop();
    }, dropTime);

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

    };

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
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper> 
    );
};

export default Tetris;
