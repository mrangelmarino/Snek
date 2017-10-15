'use strict'

class Snek {
  constructor(element, options) {
    const defaults = {
      canvasWidth: 400,
      canvasHeight: 400,
      size: 10
    }

    this.element = document.querySelectorAll(element)
    this.options = Object.assign(defaults, options)
    this.goal = {}
    this.direction = 'right'

    this.canvas()
    this.init()
  }

  canvas() {
    // draw canvas
    const canvas = document.createElement('canvas')
    const target = this.element[0] || document.body
    const ctx = canvas.getContext('2d')
    this.options.ctx = ctx
    canvas.width = this.options.canvasWidth
    canvas.height = this.options.canvasHeight
    target.appendChild(canvas)
  }

  setSnake() {
    this.snake = []

    for(var i = 4; i >= 0; i--) {
      this.snake.push({ x: i, y: 0 })
    }
    console.log('initial snake', this.snake)
  }

  placeSnake() {
    const ctx = this.options.ctx
    const snake = this.snake
    const size = this.options.size

    ctx.clearRect(0, 0, this.options.canvasWidth, this.options.canvasHeight)

    ctx.fillStyle = 'green'
    ctx.strokeStyle = 'white'

    for(let i = 0; snake.length > i; i++) {
      ctx.fillRect(snake[i].x * size, snake[i].y * size, size, size)
      ctx.strokeRect(snake[i].x * size, snake[i].y * size, size, size)
    }
  }

  setGoal() {
    // set game goal for snake
    this.goal.x = this.placePoint()
    this.goal.y = this.placePoint()
  }

  placeGoal() {
    const ctx = this.options.ctx
    const size = this.options.size

    ctx.fillStyle = 'orange'
    ctx.fillRect(this.goal.x, this.goal.y, size, size)
  }

  placePoint() {
    const min = Math.ceil(0)
    const max = Math.floor(this.options.canvasWidth - this.options.size)
    return Math.floor(Math.random() * (max-min)) + min
  }

  gameOver(x, y) {
    // determine if player lost
  }

  step() {
    const snake = this.snake
    console.log(snake)
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

    this.gameOver(x, y)

    const tail = snake.pop()
    tail.x = x
    tail.y = y
    snake.unshift(tail)

    this.snake = snake

    this.placeSnake()
    this.placeGoal()

  }

  start() {
    clearInterval(this.interval)
    this.interval = setInterval(this.step.bind(this), 1000)
  }

  init() {
    this.setSnake()
    this.placeSnake()
    this.setGoal()
    this.placeGoal()
    this.start()
  }

}

// surface constructor in absence of import or require
window.Snek = window.Snek || Snek