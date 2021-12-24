import React from 'react';
import Display from './Display';
import Stage from './Stage';
import StartButton from './StartButton';
import { createStage } from '../gameHelper';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

const Tetris = () => {
    console.log(createStage());

    return (
            <StyledTetrisWrapper>
                <StyledTetris>
                    <Stage stage={createStage()} />
                    <aside>
                        <div>
                            <Display text="Score" />
                            <Display text="Row" />
                            <Display text="Level" />
                        </div>
                        <StartButton />
                    </aside>
                </StyledTetris>
           </StyledTetrisWrapper> 
    )
} 

export default Tetris
