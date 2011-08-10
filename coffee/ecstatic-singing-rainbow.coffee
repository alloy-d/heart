WIDTH = window.innerWidth     # Example optimal: 1151 or 1.55
HEIGHT = window.innerHeight   # Example optimal:  738 or 1.00

canvas = $ 'ecstatic-singing-rainbow'
context = canvas.getContext '2d'

Control =
  resize: ->
    canvas.width = WIDTH = window.innerWidth
    canvas.height = HEIGHT = window.innerHeight

cx = cw = (x) -> x * WIDTH / 1000
cy = ch = (y) -> y * HEIGHT / 1000
rect = (r, theta, cx = 0, cy = 0) -> {
  x: Math.cos(theta) * r + cx
  y: Math.sin(theta) * r + cy
}
xy = (x, y) -> {x: x, y: y}
cxy = (x, y) -> xy(cx(x), cy(y))

EcstaticSingingRainbow = (->
  letters = ['r', 'o', 'y', 'g', 'b', 'i', 'v', 'w']
  letterToIndex = (letter) -> letters.indexOf(letter)

  BaseValues =
    start: xy(1000, 120)
    end: xy(80, 1000)
    focus: xy(300, 200)

  Increments =
    start: xy(0, 80)
    end: xy(65, 0)
    focus: xy(50, 60)

  Calc = (->
    calc = (prop) ->
      (letter) ->
        step = letterToIndex letter
        value = (dim) -> BaseValues[prop][dim] + Increments[prop][dim] * step
        cxy(value('x'), value('y'))
    {
      Start: calc 'start'
      End: calc 'end'
      Focus: calc 'focus'
    }
  )()

  Colors =
    r: 'red'
    o: 'orange'
    y: 'yellow'
    g: 'green'
    b: 'blue'
    i: 'indigo'
    v: 'violet'
    w: 'white'

  drawRainbow = ->
    drawColor = (letter) ->
      start = Calc.Start letter
      focus = Calc.Focus letter
      end = Calc.End letter

      context.beginPath()
      context.fillStyle = Colors[letter]
      context.moveTo start.x, start.y
      context.quadraticCurveTo focus.x, focus.y, end.x, end.y
      context.lineTo cx(1000), cy(1000)
      context.lineTo start.x, start.y
      context.fill()
      context.closePath()

    context.save()
    drawColor letter for letter in letters

  drawFace = (x, y, theta) ->
    lineTo = (x, y) -> context.lineTo(cx(x), cy(y))
    moveTo = (x, y) -> context.moveTo(cx(x), cy(y))
    start = cxy x, y
    context.save()
    context.rotate theta
    context.translate start.x, 0
    context.beginPath()
    context.moveTo 0, 0
    context.lineCap = "round"
    context.lineJoin = "round"

    lineTo 70, 50
    lineTo 0, 100

    moveTo 220, 0
    lineTo 150, 50
    lineTo 220, 100

    moveTo 60, 140
    lineTo 160, 140
    lineTo 110, 300
    lineTo 60, 140

    context.lineWidth = cx 19
    context.strokeStyle = 'black'
    context.stroke()
    context.lineWidth = cx 16
    context.strokeStyle = 'white'
    context.stroke()
    context.closePath()
    context.restore()

  faceLoc = xy 570, 380
  faceDir = 1

  moveFace = ->
    if faceLoc.x > 600 and faceDir is 1
      faceDir = -1
    else if faceLoc.x < 520 and faceDir is -1
      faceDir = 1
    faceLoc.x += faceDir * 5

  drawNote = (note) ->
    location = cxy note.x, note.y
    context.save()
    context.beginPath()
    context.translate location.x, location.y
    context.rotate note.theta
    context.arc 0, 0, cw(note.size), 0, 2*Math.PI, true
    context.lineTo cx(0), cy(-note.size * 9)
    context.lineTo cx(-note.size/2), cy(-note.size * 9)
    context.lineTo cx(note.size/2), cy(0)

    context.fillStyle = 'black'
    context.stroke()
    context.fill()
    context.closePath()
    context.restore()

  notes = [
    {x: 280, y: 220, theta: 0, size: 12, dir: 1},
    {x: 430, y: 200, theta: -0.2, size: 8, dir: -1},
    {x: 90,  y: 190, theta: 0.1, size: 6, dir: 1},
    {x: 180, y: 460, theta: 0.2, size: 10, dir: -1},
    {x: 80,  y: 700, theta: 0, size: 5, dir: 1},
  ]

  moveNote = (note) ->
    if note.theta < -0.3 and note.dir is -1
      note.dir = 1
    else if note.theta > 0.3 and note.dir is 1
      note.dir = -1
    note.theta += note.dir / 20

  {
    update: ->
      moveFace()
      moveNote note for note in notes
    draw: ->
      context.clearRect(0, 0, WIDTH, HEIGHT)
      drawRainbow()
      drawFace faceLoc.x, faceLoc.y, 0.5
      drawNote note for note in notes
  }
)()

window.addEvent 'domready', ->
  Control.resize()
  EcstaticSingingRainbow.draw()
  setInterval ->
    EcstaticSingingRainbow.update()
    EcstaticSingingRainbow.draw()
  , 50
window.addEvent 'resize', ->
  Control.resize()
  EcstaticSingingRainbow.draw()
