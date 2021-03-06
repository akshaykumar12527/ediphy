import React from 'react';
import { correctNumericInput, correctTextInput } from '../../../core/visor/correction_functions';
/* eslint-disable react/prop-types */

export function InputText() {
    return {
        getRenderTemplate: function(state, props) {
            let clickHandler = (e)=>{
                props.setAnswer(e.target.value);
            };
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let correct = this.checkAnswer(props.exercises.currentAnswer, props.exercises.correctAnswer, state);
            let fs = state.fontSize + 'px';
            return <span className={"exercisePlugin inputTextPlugin" + (attempted ? " attempted " : " ") + (correct ? "correct " : "incorrect ") + (props.exercises.showFeedback ? "showFeedback" : "") }>
                <input type={state.type} disabled={attempted} style={{ fontSize: fs, lineHeight: fs }} className="inputText" name={props.id} value={props.exercises.currentAnswer} onChange={clickHandler}/>
                <span className="exerciseScore">{score}</span>
            </span>;
        },
        checkAnswer(current, correct, state) {
            if (state.type === 'text') {
                return correctTextInput(current, correct, !state.characters);
            } else if (state.type === 'number') {
                return correctNumericInput(current, correct, state.precision);
            }
            return 0;
        },
    };
}
/* eslint-enable react/prop-types */
