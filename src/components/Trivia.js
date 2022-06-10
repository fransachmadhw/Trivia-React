import React from 'react'
import { unEscape } from '../utility'
import Answer from './Answer'

export default function Trivia(props) {
  const answerComponent = props.answers.map((answer) => (
    <Answer
      key={answer.id}
      value={answer.value}
      isHeld={answer.isHeld}
      isCorrect={answer.isCorrect}
      clickHandler={() => props.clickHandler(answer.id, props.id)}
      isChecked={props.isChecked}
    />
  ));
  return (
    <div className='question'>
      <p className='question-text'>{props.question}</p>
      <div className='answers'>{answerComponent}</div>
    </div>
  )
}