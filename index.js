'use strict'

class Snek {
  constructor(element, options) {
    const defaults = {
      width: 400,
      height: 400,
      size: 20
    }

    if(options && (options.width % options.size > 0 || options.height % options.size > 0)) {
      console.error('Your canvas should be evenly divisible by the size of your snek')
      options.width = Math.round(options.width / options.size) * options.size
      options.height = Math.round(options.height / options.size) * options.size
    }

    this.element = document.querySelectorAll(element)
    this.options = Object.assign(defaults, options)
    this.goal = {}
    this.score = 0
    this.topScore = localStorage.getItem('highScore') || 0

    this.gameBoard()
    this.gameMessage('Ready Player One', 'green')
    this.controls()
  }

  gameBoard() {
    // draw canvas
    const target = this.element[0] || document.body
    const canvas = document.createElement('canvas')
    canvas.width = this.options.width
    canvas.height = this.options.height
    canvas.style.border = '5px solid black'
    this.canvas = canvas

    const ctx = canvas.getContext('2d')
    this.ctx = ctx

    // additional ui
    const panel = document.createElement('div')

    const currentScore = document.createElement('p')
    currentScore.innerHTML = 'Current Score: ' + this.score
    panel.appendChild(currentScore)
    this.currentScore = currentScore

    const highScore = document.createElement('p')
    highScore.innerHTML = 'High Score: ' + this.topScore
    panel.appendChild(highScore)
    this.highScore = highScore

    const button = document.createElement('button')
    button.innerHTML = 'Start Game'
    panel.appendChild(button)
    this.startButton = button

    target.appendChild(canvas)
    target.appendChild(panel)
  }

  gameMessage(message, background) {
    const canvas = this.canvas
    const width = this.canvas.width
    const height = this.canvas.height
    const ctx = this.ctx

    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
    ctx.fill()
    ctx.font = '20px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(message, (width / 2), height / 2)
  }

  setSnake() {
    this.snake = []
    for(var i = 4; i > 0; i--) {
      this.snake.push({ x: i, y: 0 })
    }
  }

  placeSnake() {
    const ctx = this.ctx
    const snake = this.snake
    const size = this.options.size

    ctx.clearRect(0, 0, this.options.width, this.options.height)

    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'white'

    for(let i = 0; snake.length > i; i++) {
      ctx.fillRect(snake[i].x * size, snake[i].y * size, size, size)
      ctx.strokeRect(snake[i].x * size, snake[i].y * size, size, size)
    }
  }

  setGoal() {
    // set game goal for snake
    const snake = this.snake
    let x = this.returnPoint('x')
    let y = this.returnPoint('y')

    for(let i = 0; snake.length > i; i++) {
      if(x === snake[i].x && y === snake[i].y) {
        this.setGoal()
      }
    }

    this.goal.x = x
    this.goal.y = y
  }

  placeGoal() {
    const ctx = this.ctx
    const size = this.options.size

    ctx.fillStyle = 'orange'
    ctx.fillRect(this.goal.x * size, this.goal.y * size, size, size)
  }

  returnPoint(plane) {
    const size = this.options.size
    const canvasDim = plane === 'x' ? this.options.width : this.options.height
    const max = canvasDim / size
    return Math.floor(Math.random() * max)
  }

  gameOver(x, y) {
    const snake = this.snake.slice(1)

    // check collision on self
    for(let i = 0; snake.length > i; i++) {
      if(snake[i].x === x && snake[i].y === y) {
        return true
      }
    }

    // check collision on walls
    const width = this.options.width
    const height = this.options.height
    const size = this.options.size

    if(x < 0 || y < 0 || x >= (width / size) || y >= (height / size)) {
      return true
    }

    return false

  }

  step() {
    const snake = this.snake
    let x = snake[0].x
    let y = snake[0].y

    switch(this.direction) {
      case 'right':
        x++
        break;
      case 'down':
        y++
        break;
      case 'left':
        x--
        break;
      case 'up':
        y--
        break;
    }

    if(this.gameOver(x, y)) {
      this.score = 0
      clearInterval(this.interval)
      this.gameMessage('Game Over', 'red')
      return;
    }

    let tail;

    if(x === this.goal.x && y === this.goal.y) {
      tail = { x, y }
      this.score = this.score + 1
      this.currentScore.innerHTML = 'Current Score: ' + this.score
      if(this.score > this.topScore) {
        this.topScore = this.score
        localStorage.setItem('highScore', this.score)
        this.highScore.innerHTML = 'High Score: ' + this.score
      }

      this.setGoal()
    } else {
      tail = snake.pop()
      tail.x = x
      tail.y = y
    }

    snake.unshift(tail)
    this.placeSnake()
    this.placeGoal()

  }

  controls() {
    const game = this

    document.onkeydown = function(event) {
      switch(event.keyCode) {
        case 39:
          game.direction = game.direction !== 'left' ? 'right' : game.direction
          break;
        case 37:
          game.direction = game.direction !== 'right' ? 'left' : game.direction
          break;
        case 38:
          game.direction = game.direction !== 'down' ? 'up' : game.direction
          break;
        case 40:
          game.direction = game.direction !== 'up' ? 'down' : game.direction
          break;
      }

    }

    this.startButton.addEventListener('click', function(){
      game.init()
    })

  }

  start() {
    clearInterval(this.interval)
    this.interval = setInterval(this.step.bind(this), 100)
  }

  init() {
    this.direction = 'right'
    this.setSnake()
    this.placeSnake()
    this.setGoal()
    this.placeGoal()
    this.start()
  }

}

// surface constructor in absence of import or require
window.Snek = window.Snek || Snek