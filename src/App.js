import React from 'react'
import './style.css'
import Trivia from './components/Trivia'
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

function App() {
  const [started, setStarted] = React.useState(false)
  const [isChecked, setIsChecked] = React.useState(false)
  const [customisation, setCustomisation] = React.useState([])
  const [isFetched, setIsFetched] = React.useState(false)
  const [triviaArray, setTriviaArray] = React.useState()
  // const [score, setScore] = React.useState(0)
  // const [error, setError] = React.useState(null)
  const [isCustomisationHidden, setIsCustomisationHidden] = React.useState(true)
  const [numOfQuestions, setNumOfQuestions] = React.useState("5")
	const [difficulty, setDifficulty] = React.useState("easy")
	const [category, setCategory] = React.useState("9")

  React.useEffect(() => {
    callData()
  }, [started])

  function updateCustomisation(a, b, c) {
		setCustomisation([a, b, c])
		startGame()
	}

  function callData() {
    fetch(`https://opentdb.com/api.php?amount=${numOfQuestions}&category=${customisation[1]}&type=multiple&difficulty=${customisation[2]}`)
      .then(res => res.json())
      .then(data => createTriviaObject(data.results))
      .then((objsArray) => {
        setTriviaArray(objsArray)
        setIsChecked(false);
      })
      // .catch((err) => {
      //   // console.log(err.message);
      //   setError(err);
      // })
      .finally(() => {
        //setLoading(false);
        setIsFetched(true);
      });
  }

  function createTriviaObject(array) {
    return (
      array &&
      array.map((item) => {
        return {
          ...item,
          id: nanoid(),
          correct_answer: convertCorrectAnswerToObject(item.correct_answer),
          incorrect_answer: convertIncorrectAnswerToObject(item.incorrect_answers),
          answers: shuffleArray([
            ...convertIncorrectAnswerToObject(item.incorrect_answers),
            convertCorrectAnswerToObject(item.correct_answer),
          ]),
        }
      })
    )
  }

  function convertCorrectAnswerToObject(answer) {
    return {
      value: answer,
      id: nanoid(),
      isHeld: false,
      isCorrect: true,
    }
  }

  function convertIncorrectAnswerToObject(answers) {
    return answers.map((answer) => {
      return {
        value: answer,
        id: nanoid(),
        isHeld: false,
        isCorrect: false,
      };
    });
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function answerClickHandler(answerId, questionId) {
    !isChecked &&
      setTriviaArray((prevArray) => {
        return prevArray.map((question) => {
          return question.id === questionId
            ? {
                ...question,
                answers: question.answers.map((answer) => {
                  return answer.id === answerId
                    ? { ...answer, isHeld: true }
                    : { ...answer, isHeld: false };
                }),
              }
            : question;
        });
      });
  }

  const triviaComponent = triviaArray && triviaArray.map((trivia) => {
    return (
      <Trivia
        key={trivia.id}
        question={trivia.question}
        answers={trivia.answers}
        id={trivia.id}
        clickHandler={answerClickHandler}
        isChecked={isChecked}
      />
    )
  })

  function checkAnswersButton() {
    setIsChecked(true)
  }

  function correctAnswersNum() {
    let num = 0;
    for (let i = 0; i < triviaArray.length; i++) {
      for (let j = 0; j < triviaArray[i].answers.length; j++) {
        const answer = triviaArray[i].answers[j];
        if (answer.isHeld && answer.isCorrect) {
          num++;
        }
      }
    }

    return num
  }


  function startGame() {
    setStarted(e => !e)
  }

  return (
    <main>
      {
        !started ? (
          <div className='intro-container'>
            <h1>Trivia</h1>
            <h3>I promise it's gonna be tough 😉</h3>
            <div className='buttons'>
              <button className='button' onClick={() => updateCustomisation(numOfQuestions, category, difficulty)}>Start quiz</button>
              <button className='button customise-btn' onClick={() => setIsCustomisationHidden(e => !e)}>{isCustomisationHidden ? 'Customise' : 'Back'}</button>
            </div>
            {!isCustomisationHidden && (
              <div className='customise-container'>
                <h2>Customise Game</h2>
                <label htmlFor="num-of-questions">Number of Questions: {numOfQuestions}</label>
				        <input
				        	type="range"
				        	name="num-of-questions"
				        	id="num-of-questions"
				        	min="5"
				        	max="20"
				        	step={1}
				        	onChange={(e) => setNumOfQuestions(e.target.value)}
				        	value={numOfQuestions}
				        />
                <label htmlFor="difficulty">Difficulty:</label>
				        <select id="difficulty" onChange={(e) => setDifficulty(e.target.value)}>
				        	<option value="easy">Easy</option>
				        	<option value="medium">Medium</option>
				        	<option value="hard">Hard</option>
				        </select>
                <label htmlFor="category">Category:</label>
                <select id="category" onChange={(e) => setCategory(e.target.value)}>
                  <option value="9">General Knowledge</option>
                  <option value="10">Entertainment: Books</option>
                  <option value="11">Entertainment: Film</option>
                  <option value="12">Entertainment: Music</option>
                  <option value="13">Entertainment: Musicals &amp; Theatres</option>
                  <option value="14">Entertainment: Television</option>
                  <option value="15">Entertainment: Video Games</option>
                  <option value="16">Entertainment: Board Games</option>
                  <option value="17">Science &amp; Nature</option>
                  <option value="18">Science: Computers</option>
                  <option value="19">Science: Mathematics</option>
                  <option value="20">Mythology</option>
                  <option value="21">Sports</option>
                  <option value="22">Geography</option>
                  <option value="23">History</option>
                  <option value="24">Politics</option>
                  <option value="25">Art</option>
                  <option value="26">Celebrities</option>
                  <option value="27">Animals</option>
                  <option value="28">Vehicles</option>
                  <option value="29">Entertainment: Comics</option>
                  <option value="30">Science: Gadgets</option>
                  <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                  <option value="32">Entertainment: Cartoon &amp; Animations</option>
                </select>
              </div>
              )
            }
          </div>
        ) : (
          <div className='trivia-container'>
            <h2>Good Luck! 😛</h2>
            <div className='trivia-container-2'>{triviaArray && triviaComponent}</div>
            {!isChecked ? (
              isFetched && (
                <div className='trivia-buttons'>
                  <button
                    className='button check-button'
                    onClick={checkAnswersButton}
                  >Check answers</button>
                  <button
                    className='button back-button'
                    onClick={startGame}
                  >Go back</button>
                </div>
              )
            ) : (
                <div className='score'>
                  <p className='score-text'>
                  You scored {correctAnswersNum()}/{triviaArray.length} correct
                  answers.
                  {correctAnswersNum() === triviaArray.length && <Confetti       width={window.innerWidth}
                  height={window.innerHeight}/>}
                  </p>
                  <div className='trivia-buttons'>
                    <button className='button' onClick={() => {
                        setIsFetched(false)
                        callData()
                    }}>
                    Play again
                    </button>
                    <button
                      className='button back-button'
                      onClick={startGame}
                    >Go back</button>
                  </div>
                </div>

              )
            }
          </div>
        )
      }
    </main>
  );
}

export default App;
