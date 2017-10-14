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
    this.snake = []
    this.goal = {}
    this.direction = 'right'
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

  placeGoal() {
    // set game goal for snake
    const ctx = this.options.ctx
    const size = this.options.size

    this.goal.x = this.placePoint()
    this.goal.y = this.placePoint()

    ctx.fillStyle = 'orange'
    ctx.fillRect(this.goal.x, this.goal.y, size, size)
  }

  placePoint() {
    const min = Math.ceil(0)
    const max = Math.floor(this.options.canvasWidth - this.options.size)
    return Math.floor(Math.random() * (max-min)) + min
  }

  gameOver() {
    // determine if player lost
  }

  step() {
    // increment game
  }

  init() {
    this.canvas()
    this.placeGoal()
  }

}

// surface constructor in absence of import or require
window.Snek = window.Snek || Snek