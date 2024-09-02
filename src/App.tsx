import { useState, Fragment } from 'react'
import './App.css'

const questions = [
  {
    text: "Question 1",
    choices: ["choice 1", "choice 2", "correct answer"],
    answer: 2
  },
  {
    text: "Question 2",
    choices: ["choice 1", "choice 2", "choice 3", "choice 4", "correct answer", "choice 5"],
    answer: 4
  },
  {
    text: "What is my favorite color?",
    choices: ["Red", "Blue", "Green"],
    answer: 1
  },
  {
    text: "What is my favorite song?",
    choices: ["Salamin, Salamin by BINI", "R U Mine by Arctic Monkeys", "Cupid by FIFTY FIFTY", "Love Team by the Itchyworms"],
    answer: 3
  },
  {
    text: "2 + 2 = ?",
    choices: ["3", "4", "Fish", "None of the above"],
    answer: 1
  },
]

function Landing({ handleStart }) {
  return (
    <>
      <div>
        Welcome! You will be taking a {questions.length}-question multiple choice quiz.
        <br />
        Select the best answer among the choices given. Good luck!
      </div>
      <button onClick={handleStart}>Start Quiz</button>
    </>
  )
}

function Quiz({ answers, handleSetAnswer, handleSubmit }) {
  const [questionNum, setQuestionNum] = useState(0)
  const [checked, setChecked] = useState(-1)

  const onAnswerChange = e => {
    console.log(e.target.value)
    setChecked(parseInt(e.target.value))
  }

  return (
    <>
      <div>Question {questionNum + 1} of {questions.length}</div>
      <div>{questions[questionNum].text}</div>
      <div className='input-container'>
        {questions[questionNum].choices.map((choice, index) => 
          <Fragment key={index}>
            <input 
              type="radio" 
              value={index} 
              name={questionNum.toString()} 
              checked={index == checked}
              onChange={onAnswerChange}
            /> 
            <label>{choice}</label> 
            <br />
          </Fragment>
        )}
      </div>
      {questionNum > 0 && 
        <button onClick={() => {
          const newQuestionNum = questionNum - 1

          handleSetAnswer(questionNum, checked)
          setQuestionNum(newQuestionNum)
          setChecked(answers[newQuestionNum])
          
          console.log(answers)
        }}>Prev</button>
      }
      {questionNum + 1 < answers.length ? 
        <button onClick={() => {
          const newQuestionNum = questionNum + 1

          handleSetAnswer(questionNum, checked)
          setQuestionNum(newQuestionNum)
          setChecked(answers[newQuestionNum])

          console.log(answers)
        }}>Next</button> :
        <button onClick={() => {
          handleSetAnswer(questionNum, checked)
          handleSubmit()

          console.log(answers)
        }}>Submit</button>
      }
    </>
  )
}

function Feedback({ answers, handleReturn, handleRetry }) {
  let score = 0
  for (const [questionNum, question] of questions.entries()) {
    if (answers[questionNum] == question.answer)
      score += 1
  }
  const maxScore = questions.length
  
  return (
    <>
      <div>Your score is:</div>
      <div className='score'>{score} / {maxScore}</div>
      {score > (0.6 * maxScore) ? 
        <div>Great job! you passed!</div> :
        <div>You failed... Better luck next time!</div>
      }
      <button onClick={handleReturn}>Return</button>
      <button onClick={handleRetry}>Retry</button>
    </>
  )
}

function App() {
  const [answers, setAnswers] = useState(new Array(questions.length).fill(-1))
  const [page, setPage] = useState('landing')

  const handleSetAnswer = (newAnswerIndex : number, newAnswer : number) => {
    // update the value at newAnswerIndex to newAnswer
    setAnswers(a => a.map((val, index) => index === newAnswerIndex ? newAnswer : val))
  }

  if (page === 'landing') {
    return <Landing 
      handleStart={() => {
        setAnswers(new Array(questions.length).fill(-1))
        setPage('quiz')
      }}
    />
  }
  else if (page === 'quiz') {
    return <Quiz answers={answers} handleSetAnswer={handleSetAnswer} handleSubmit={() => setPage('feedback')} />
  }
  else if (page === 'feedback') {
    return <Feedback answers={answers} handleReturn={() => setPage('landing')} handleRetry={() => {
        setAnswers(new Array(questions.length).fill(-1))
        setPage('quiz')
      }} 
    />
  }
}

export default App
