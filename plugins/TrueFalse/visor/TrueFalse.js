import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
import { correctArrayOrdered } from '../../../core/visor/correction_functions';

/* eslint-disable react/prop-types */

export function TrueFalse() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer[i] === props.exercises.currentAnswer[i];
                let incorrect = attempted && !correct;
                let clickHandler = (index, value)=>{
                    if(props.exercises && props.exercises.currentAnswer && (props.exercises.currentAnswer instanceof Array)) {

                        let nBoxes = Array(state.nBoxes).fill("");
                        let newAnswer = nBoxes.map((ans, ind)=>{
                            if (index === ind) {
                                return value;
                            }
                            return props.exercises.currentAnswer[ind];
                        });
                        props.setAnswer(newAnswer);
                    }

                };
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-1 answerPlaceholder"}>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id + '_' + i}
                                value={i} checked={ props.exercises && props.exercises.currentAnswer[i] === "true" }
                                onChange={(e)=>{ clickHandler(i, "true"); }}/>
                        </div>
                        <div className={"col-xs-1 answerPlaceholder"}>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id + '_' + i}
                                value={i} checked={props.exercises && props.exercises.currentAnswer[i] === "false"}
                                onChange={(e)=>{ clickHandler(i, "false"); }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                        <i className={ "material-icons " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")} style={{ display: (correct || incorrect) ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>
                    </div>);

            }

            return <div className={"exercisePlugin truefalsePlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                <div className={"row TFRow"} key={0}>
                    <div className={"col-xs-1 "}><i className="material-icons true">done</i></div>
                    <div className={"col-xs-1"}><i className="material-icons false">clear</i></div>
                    <div className={"col-xs-10"} />
                </div>
                {content}
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct, state) {
            return correctArrayOrdered(current, correct, state.nBoxes, state.allowPartialScore);
        },
    };
}
/* eslint-enable react/prop-types */
