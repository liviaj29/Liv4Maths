import { Nanny,html } from 'nanny-state';


const randomNumber = n => Math.ceil(Math.random()*n)

function sum(level, symbols) {
  const a = level === 'easy' ? 10 : level === 'medium' ? 20 : 50
  const x = randomNumber(a)
  const y = randomNumber(a)
  const symbol = symbols[Math.floor(Math.random()*symbols.length)]
  const questions = {
    add: [`${x} + ${y} = `, x+y],
    subtract: [`${x} - ${y} = `, x-y],
    multiply: [`${x} x ${y} = `, x*y],
    divide: [`${x*y} ÷ ${x} = `, y] 
  }
  return {question: questions[symbol][0],answer: questions[symbol][1]}
}

const View = state => html`
<h1>LIV4MATHS</h1>
<h2>High Score: ${state.highScore}</h2>
${ state.started ? state.playing ? html`
<h3> SCORE: ${state.score} /10</h3> 
<h4 id='timer'> TIME: ${state.time} seconds </h4>
<div id="question"><span class="questionNumber">${state.count}</span>)  ${state.question} ${state.userAnswer} ${state.result} </div> 
<form onsubmit = ${answer}>
  <input type='text' name = 'name' id = 'answer'>
</form>` : html`
<div class = "buttons">
  <button onclick=${startGame('easy')})}><span>EASY</span></button>
  <button onclick=${startGame('medium')}><span>MEDIUM</span></button>
  <button onclick=${startGame('hard')}><span>HARD</span></button>
</div>`

: html`
${state.message}
<div class="buttons">
<button onclick=${e => Update({started: true})}> <span> ${state.count === 10? "Play Again": "Start!"} </span></button>
</div>
`
}`




const startGame = level => event => {
  Update(generateSum(level))
  document.getElementById('answer').focus() 
}

                               

const tick = state => ({time: state.time + 1}) 

const generateSum = level => state =>
      ({
        playing: true, 
        userAnswer: '',
        count: 1,
        score: 0, 
        time: 0,
        level,
        ...sum(level, state.symbols)
      })


const State = {
  symbols: ['add','subtract','multiply','divide'],
  message: html`<h2>Can You Get 10/10?</h2>`,
  time: 0,
  playing: false,
  started: false,
  highScore: 0,
  View,
}



const answer = event => {
  event.preventDefault()
  Update(checkAnswer(Number(event.target.name.value)))
  setTimeout(()=>Update(newQuestion), 700)
  event.target.answer.value = ''
}


const newQuestion = state => state.count === 10
? {
    playing: false,
    started: false,
    result: '',
    highScore: state.score > state.highScore ? state.score : state.highScore,
    message: html`<h2>FINISHED!</h2> 
      <h3>YOU GOT <span>${state.score}/10</span> IN ${state.time} seconds</h3> 
      <h4>${feedback(state.score)}</h4>`,
} 
: {
    ...sum(state.level,state.symbols),
    userAnswer: '',
    result: '',
    count: state.count + 1,
    playing: true,
  }


const checkAnswer = answer => state =>
  ({
    userAnswer: answer,
    result: answer === state.answer ? '✔': '❌',
    score: answer === state.answer ? state.score + 1: state.score,
  })


const feedback = score => score===10 ? html`<h4>Full Marks!! Wow!</h4>`: html`<h4>Keep Practising! You can do it!</h4>`

setInterval(() => Update(tick), 1000) 


const Update = Nanny(State)