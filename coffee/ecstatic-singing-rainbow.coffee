WIDTH = window.innerWidth     # Example optimal: 1151 or 1.55
HEIGHT = window.innerHeight   # Example optimal:  738 or 1.00

canvas = $ 'ecstatic-singing-rainbow'
context = canvas.getContext '2d'

pt = (x, y) -> {x: x, y: y}
rect = (r, theta, cx = 0, cy = 0) -> {
  x: Math.cos(theta) * r + cx
  y: Math.sin(theta) * r + cy
}

S = Sizer =
  w: (w) -> w * WIDTH / 1000
  h: (h) -> h * HEIGHT / 1000
  x: (x) -> @w(x)
  y: (y) -> @h(y)
  pt: (x, y) -> pt @x(x), @y(y)
  resize: ->
    canvas.width = WIDTH = canvas.getStyle('width').toInt()
    canvas.height = HEIGHT = canvas.getStyle('height').toInt()

    size = pt WIDTH, HEIGHT
    offset = pt 0, 0
    ratio = (WIDTH / HEIGHT).round(2)
    if ratio > 1.55
      size.x = HEIGHT * 1.55
      offset.x = (WIDTH - size.x)
    else if ratio < 1.55
      size.y = WIDTH / 1.55
      offset.y = (HEIGHT - size.y)

    @w = (w) -> w * size.x / 1000
    @h = (h) -> h * size.y / 1000
    @x = (x) -> @w(x) + offset.x
    @y = (y) -> @h(y) + offset.y

EcstaticSingingRainbow = (->
  Rainbow = (->
    letters = ['r', 'o', 'y', 'g', 'b', 'i', 'v', 'w']
    letterToIndex = (letter) -> letters.indexOf(letter)

    BaseValues =
      start: pt(1000, 120)
      end: pt(80, 1000)
      focus: pt(300, 200)

    Increments =
      start: pt(0, 80)
      end: pt(65, 0)
      focus: pt(50, 60)

    Calc = (->
      calc = (prop) ->
        (letter) ->
          step = letterToIndex letter
          value = (dim) ->
            BaseValues[prop][dim] + Increments[prop][dim] * step
          S.pt(value('x'), value('y'))
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

    {
      draw: ->
        drawColor = (letter) ->
          start = Calc.Start letter
          focus = Calc.Focus letter
          end = Calc.End letter

          context.beginPath()
          context.fillStyle = Colors[letter]
          context.moveTo start.x, start.y
          context.quadraticCurveTo focus.x, focus.y, end.x, end.y
          context.lineTo S.x(1000), S.y(1000)
          context.lineTo start.x, start.y
          context.fill()
          context.closePath()

        context.save()
        drawColor letter for letter in letters
    }
  )()

  Face =
    x: 570
    y: 380
    dir: 1
    draw: ->
      lineTo = (x, y) -> context.lineTo(S.x(x), S.y(y))
      moveTo = (x, y) -> context.moveTo(S.x(x), S.y(y))
      start = S.pt @x, @y
      context.save()
      context.translate S.x(0), S.y(0)
      context.rotate 0.5
      context.translate start.x, S.y 0
      context.beginPath()
      context.lineCap = "round"
      context.lineJoin = "round"

      moveTo 0, 0
      lineTo 70, 50
      lineTo 0, 100

      moveTo 220, 0
      lineTo 150, 50
      lineTo 220, 100

      moveTo 60, 140
      lineTo 160, 140
      lineTo 110, 300
      lineTo 60, 140

      context.lineWidth = S.w 19
      context.strokeStyle = 'black'
      context.stroke()
      context.lineWidth = S.w 16
      context.strokeStyle = 'white'
      context.stroke()
      context.closePath()
      context.restore()

    move: ->
      if @x > 600 and @dir is 1
        @dir = -1
      else if @x < 520 and @dir is -1
        @dir = 1
      @x += @dir * 5

  class Note
    constructor: (@x, @y, @theta, @size, @dir) ->

    draw: ->
      location = S.pt @x, @y
      x = S.w   # x should be relative to location
      y = S.h   # y should be relative to location
      context.save()
      context.beginPath()
      context.translate location.x, location.y
      context.rotate @theta
      context.arc 0, 0, x(@size), 0, 2*Math.PI, true
      context.lineTo 0, y(-@size * 9)
      context.lineTo x(-@size/2), y(-@size * 9)
      context.lineTo x(@size/2), 0

      context.fillStyle = 'black'
      context.stroke()
      context.fill()
      context.closePath()
      context.restore()

    move: ->
      if @theta < -0.3 and @dir is -1
        @dir = 1
      else if @theta > 0.3 and @dir is 1
        @dir = -1
      @theta += @dir / 20

  notes = [
    #          x,   y, theta, sz, dir
    new Note 280, 220,     0, 12,   1
    new Note 430, 200,  -0.2,  8,  -1
    new Note  90, 190,   0.1,  6,   1
    new Note 180, 460,   0.2, 10,  -1
    new Note  80, 700,     0,  5,   1
  ]

  {
    update: ->
      Face.move()
      note.move() for note in notes
    draw: ->
      context.clearRect(0, 0, WIDTH, HEIGHT)
      Rainbow.draw()
      Face.draw()
      note.draw() for note in notes
  }
)()

window.addEvent 'domready', ->
  Sizer.resize()
  EcstaticSingingRainbow.draw()
  setInterval ->
    EcstaticSingingRainbow.update()
    EcstaticSingingRainbow.draw()
  , 50
window.addEvent 'resize', ->
  Sizer.resize()
  EcstaticSingingRainbow.draw()
