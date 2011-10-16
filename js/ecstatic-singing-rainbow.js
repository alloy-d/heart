(function() {
  var EcstaticSingingRainbow, HEIGHT, S, Sizer, WIDTH, canvas, context, pt;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  canvas = $('ecstatic-singing-rainbow');
  context = canvas.getContext('2d');
  pt = function(x, y) {
    return {
      x: x,
      y: y
    };
  };
  S = Sizer = {
    w: function(w) {
      return w * WIDTH / 1000;
    },
    h: function(h) {
      return h * HEIGHT / 1000;
    },
    x: function(x) {
      return this.w(x);
    },
    y: function(y) {
      return this.h(y);
    },
    pt: function(x, y) {
      return pt(this.x(x), this.y(y));
    },
    resize: function() {
      var offset, ratio, size;
      canvas.width = WIDTH = canvas.getStyle('width').toInt();
      canvas.height = HEIGHT = canvas.getStyle('height').toInt();
      size = pt(WIDTH, HEIGHT);
      offset = pt(0, 0);
      ratio = (WIDTH / HEIGHT).round(2);
      if (ratio > 1.55) {
        size.x = HEIGHT * 1.55;
        offset.x = WIDTH - size.x;
      } else if (ratio < 1.55) {
        size.y = WIDTH / 1.55;
        offset.y = HEIGHT - size.y;
      }
      this.w = function(w) {
        return w * size.x / 1000;
      };
      this.h = function(h) {
        return h * size.y / 1000;
      };
      this.x = function(x) {
        return this.w(x) + offset.x;
      };
      return this.y = function(y) {
        return this.h(y) + offset.y;
      };
    }
  };
  EcstaticSingingRainbow = (function() {
    var Face, Note, Rainbow, notes;
    Rainbow = (function() {
      var BaseValues, Calc, Colors, Increments, letterToIndex, letters;
      letters = ['r', 'o', 'y', 'g', 'b', 'i', 'v', 'w'];
      letterToIndex = function(letter) {
        return letters.indexOf(letter);
      };
      BaseValues = {
        start: pt(1000, 120),
        end: pt(80, 1000),
        focus: pt(300, 200)
      };
      Increments = {
        start: pt(0, 80),
        end: pt(65, 0),
        focus: pt(50, 60)
      };
      Calc = (function() {
        var calc;
        calc = function(prop) {
          return function(letter) {
            var step, value;
            step = letterToIndex(letter);
            value = function(dim) {
              return BaseValues[prop][dim] + Increments[prop][dim] * step;
            };
            return S.pt(value('x'), value('y'));
          };
        };
        return {
          Start: calc('start'),
          End: calc('end'),
          Focus: calc('focus')
        };
      })();
      Colors = {
        r: 'red',
        o: 'orange',
        y: 'yellow',
        g: 'green',
        b: 'blue',
        i: 'indigo',
        v: 'violet',
        w: 'white'
      };
      return {
        draw: function() {
          var drawColor, letter, _i, _len, _results;
          drawColor = function(letter) {
            var end, focus, start;
            start = Calc.Start(letter);
            focus = Calc.Focus(letter);
            end = Calc.End(letter);
            context.beginPath();
            context.fillStyle = Colors[letter];
            context.moveTo(start.x, start.y);
            context.quadraticCurveTo(focus.x, focus.y, end.x, end.y);
            context.lineTo(S.x(1000), S.y(1000));
            context.lineTo(start.x, start.y);
            context.fill();
            return context.closePath();
          };
          context.save();
          _results = [];
          for (_i = 0, _len = letters.length; _i < _len; _i++) {
            letter = letters[_i];
            _results.push(drawColor(letter));
          }
          return _results;
        }
      };
    })();
    Face = {
      x: 570,
      y: 380,
      dir: 1,
      draw: function() {
        var lineTo, moveTo, start;
        lineTo = function(x, y) {
          return context.lineTo(S.w(x), S.h(y));
        };
        moveTo = function(x, y) {
          return context.moveTo(S.w(x), S.h(y));
        };
        start = pt(S.w(this.x), S.h(this.y));
        context.save();
        context.translate(S.x(0), S.y(0));
        context.rotate(0.5);
        context.translate(start.x, S.h(0));
        context.beginPath();
        context.lineCap = "round";
        context.lineJoin = "round";
        moveTo(0, 0);
        lineTo(70, 50);
        lineTo(0, 100);
        moveTo(220, 0);
        lineTo(150, 50);
        lineTo(220, 100);
        moveTo(60, 140);
        lineTo(160, 140);
        lineTo(110, 300);
        lineTo(60, 140);
        context.lineWidth = S.w(19);
        context.strokeStyle = 'black';
        context.stroke();
        context.lineWidth = S.w(16);
        context.strokeStyle = 'white';
        context.stroke();
        context.closePath();
        return context.restore();
      },
      move: function() {
        if (this.x > 600 && this.dir === 1) {
          this.dir = -1;
        } else if (this.x < 520 && this.dir === -1) {
          this.dir = 1;
        }
        return this.x += this.dir * 5;
      }
    };
    Note = (function() {
      function Note(x, y, theta, size, dir) {
        this.x = x;
        this.y = y;
        this.theta = theta;
        this.size = size;
        this.dir = dir;
      }
      Note.prototype.draw = function() {
        var location, x, y;
        location = S.pt(this.x, this.y);
        x = S.w;
        y = S.h;
        context.save();
        context.beginPath();
        context.translate(location.x, location.y);
        context.rotate(this.theta);
        context.arc(0, 0, x(this.size), 0, 2 * Math.PI, true);
        context.lineTo(0, y(-this.size * 9));
        context.lineTo(x(-this.size / 2), y(-this.size * 9));
        context.lineTo(x(this.size / 2), 0);
        context.fillStyle = 'black';
        context.stroke();
        context.fill();
        context.closePath();
        return context.restore();
      };
      Note.prototype.move = function() {
        if (this.theta < -0.3 && this.dir === -1) {
          this.dir = 1;
        } else if (this.theta > 0.3 && this.dir === 1) {
          this.dir = -1;
        }
        return this.theta += this.dir / 20;
      };
      return Note;
    })();
    notes = [new Note(280, 220, 0, 12, 1), new Note(430, 200, -0.2, 8, -1), new Note(90, 190, 0.1, 6, 1), new Note(180, 460, 0.2, 10, -1), new Note(80, 700, 0, 5, 1)];
    return {
      update: function() {
        var note, _i, _len, _results;
        Face.move();
        _results = [];
        for (_i = 0, _len = notes.length; _i < _len; _i++) {
          note = notes[_i];
          _results.push(note.move());
        }
        return _results;
      },
      draw: function() {
        var note, _i, _len, _results;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        Rainbow.draw();
        Face.draw();
        _results = [];
        for (_i = 0, _len = notes.length; _i < _len; _i++) {
          note = notes[_i];
          _results.push(note.draw());
        }
        return _results;
      }
    };
  })();
  window.addEvent('domready', function() {
    Sizer.resize();
    EcstaticSingingRainbow.draw();
    return setInterval(function() {
      EcstaticSingingRainbow.update();
      return EcstaticSingingRainbow.draw();
    }, 50);
  });
  window.addEvent('resize', function() {
    Sizer.resize();
    return EcstaticSingingRainbow.draw();
  });
}).call(this);
