const context = document.querySelector('canvas').getContext('2d')

context.canvas.height = 400
context.canvas.width = 1220

// start the frame count at 1
let frameCount = 1

// set the number of obstacles to match the current frame number
let obstacleCount = frameCount

// create an array to hold the randomly generation x coords
const obstacleCoords = []

const square = {
  height: 32,
  jumping: true,
  width: 32,
  x: 0,
  xVelocity: 0,
  y: 0,
  yVelocity: 0
}

const controller = {
  left: false,
  right: false,
  up: false,

  keyListener: function (event) {
    let key_state = event.type == 'keydown' ? true : false

    switch (event.keyCode) {
      case 37: // left arrow
        controller.left = key_state
        break
      case 38: // up arrow
        controller.up = key_state
        break
      case 39: // right arrow
        controller.right = key_state
        break
    }
  }
}

const loop = function () {
  if (controller.up && square.jumping === false) {
    square.yVelocity -= 40
    square.jumping = true
  }

  if (controller.left) {
    square.xVelocity -= 0.5
  }

  if (controller.right) {
    square.xVelocity += 0.5
  }

  square.yVelocity += 0.5 // gravity
  square.x += square.xVelocity
  square.y += square.yVelocity
  square.xVelocity *= 0.9 // friction
  square.yVelocity *= 0.9 // friction

  // if square is falling below floor line
  if (square.y > 386 - 16 - 32) {
    square.jumping = false
    square.y = 386 - 16 - 32
    square.yVelocity = 0
  }

  if (square.x < -20) {
    square.x = 1220
  } else if (square.x > 1220) {
    square.x = -20
    nextFrame()
  }

  // creates the backdrop for each frame
  context.fillStyle = '#201A23'
  context.fillRect(0, 0, 1220, 400)

  // creates and fills the cube for each frame
  context.fillStyle = '#8DAA9D'
  context.beginPath()
  context.rect(square.x, square.y, square.width, square.height)
  context.fill()

  // create the obstacles for each frame
  const height = 200 * Math.cos(Math.PI / 6)
  context.fillStyle = '#FBF5F3'

  obstacleCoords.forEach((coord) => {
    context.beginPath()

    // (x = random, y = coord on "gound")
    context.moveTo(coord, 385)

    // (x = ^random + 20, y = coord on "ground")
    context.lineTo(coord + 20, 385)

    // (x = ^random + 10, y = peak of triangle)
    context.lineTo(coord + 10, 510 - height)

    context.closePath()
    context.fill()
  })

  // creates the ground for each frame
  context.strokeStyle = '#2E2532'
  context.lineWidth = 30
  context.beginPath()
  context.moveTo(0, 385)
  context.lineTo(1220, 385)
  context.stroke()

  window.requestAnimationFrame(loop)
}

const nextFrame = () => {
  // increase the frame count
  frameCount++

  for (let i = 0; i < obstacleCount; i++) {
    // Randomly generate x coord for the top corner start of each triangle
    let obstacleCoord = Math.floor(Math.random() * (1165 - 140 + 1) + 140)

    obstacleCoords.push(obstacleCoord)
  }
}

window.addEventListener('keydown', controller.keyListener)
window.addEventListener('keyup', controller.keyListener)

window.requestAnimationFrame(loop)
