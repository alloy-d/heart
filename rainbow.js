var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var cnv = $('rainbow');
var ctx = cnv.getContext("2d");

var Control = {
    resize: function () {
        cnv.width = WIDTH = window.innerWidth;
        cnv.height = HEIGHT = window.innerHeight;
    },
}

var Boring = {
    cx: function (x) { return x * WIDTH / 1000; },
    cy: function (y) { return y * HEIGHT / 1000; },
    rect: function (r, theta, cx, cy) {
        if (typeof(cx) !== "number" || typeof(cy) !== "number") {
            cx = 0;
            cy = 0;
        }
        return {
            x: Math.cos(theta) * r + cx,
            y: Math.sin(theta) * r + cy,
        };
    },
    wr: function (n) { return Math.floor(Math.random() * n); },
    pair_to_coords: function (x, y) { return {x: x, y: y}; },
};
var cx = Boring.cx;
var cy = Boring.cy;
var cw = cx;
var ch = cy;
var xy = Boring.pair_to_coords;
var cxy = function (x, y) { return xy(cx(x), cy(y)); };

var EcstaticSingingRainbow = (function () {
    var letters = ['r', 'o', 'y', 'g', 'b', 'i', 'v', 'w'];
    var ctoi = function (letter) {
        return letters.indexOf(letter);
    }
    var Base = {
        start: xy(1000, 120),
        end: xy(80, 1000),
        focus: xy(300, 200),
    }
    var Inc = {
        start: xy(0, 80),
        end: xy(65, 0),
        focus: xy(50, 60),
    }
    var Calc = (function () {
        var calc = function (prop) {
            return function (letter) {
                var step = ctoi(letter);
                return cxy(Base[prop].x + Inc[prop].x * step,
                           Base[prop].y + Inc[prop].y * step);
            }
        }

        return {
            Start: calc("start"),
            End: calc("end"),
            Focus: calc("focus"),
        };
    }());
    var Colors = {
        r: "red",
        o: "orange",
        y: "yellow",
        g: "green",
        b: "blue",
        i: "indigo",
        v: "violet",
        w: "white",
    };

    var drawRainbow = function () {
        var c, start, focus, end;
        ctx.save();
        letters.each(function (letter) {
            c = Colors[letter];
            start = Calc.Start(letter);
            focus = Calc.Focus(letter);
            end = Calc.End(letter);

            ctx.beginPath();
            ctx.fillStyle = c;
            ctx.moveTo(start.x, start.y);
            ctx.quadraticCurveTo(focus.x, focus.y,
                                 end.x, end.y);
            ctx.lineTo(cx(1000), cy(1000));
            ctx.lineTo(start.x, start.y);
            ctx.fill();
            ctx.closePath();
        });
        ctx.restore();
    };

    var drawFace = function (x, y, theta) {
        var start = cxy(x, y);
        ctx.save();
        ctx.rotate(theta);
        ctx.translate(start.x, 0);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(cx(70), cy(50));
        ctx.lineTo(cx(0), cy(100));

        ctx.moveTo(cx(220), cy(0));
        ctx.lineTo(cx(150), cy(50));
        ctx.lineTo(cx(220), cy(100));

        ctx.moveTo(cx(60), cy(140));
        ctx.lineTo(cx(160), cy(140));
        ctx.lineTo(cx(110), cy(300));
        ctx.lineTo(cx(60), cy(140));

        ctx.lineWidth = cx(19);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.lineWidth = cx(16);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    };

    var faceLoc = xy(570, 380);
    var faceDir = 1;

    var moveFace = function () {
        if (faceLoc.x > 600 && faceDir > 0) {
            faceDir = -1;
        } else if (faceLoc.x < 520 && faceDir < 0) {
            faceDir = 1;
        }
        faceLoc.x += faceDir * 5;
    }

    var drawNote = function (note) {
        var loc = cxy(note.x, note.y);
        ctx.save();
        ctx.beginPath();
        ctx.translate(loc.x, loc.y);
        ctx.rotate(note.theta);
        ctx.arc(0, 0, cw(note.size), 0, 2*Math.PI, true);
        ctx.lineTo(cx(0), cy(-note.size * 9));
        ctx.lineTo(cx(-note.size/2), cy(-note.size * 9));
        ctx.lineTo(cx(note.size/2), cy(0));

        ctx.fillStyle = "black";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    var notes = [
        {x: 280, y: 220, theta: 0, size: 12, dir: 1},
        {x: 430, y: 200, theta: -0.2, size: 8, dir: -1},
        {x: 90,  y: 190, theta: 0.1, size: 6, dir: 1},
        {x: 180, y: 460, theta: 0.2, size: 10, dir: -1},
        {x: 80,  y: 700, theta: 0, size: 5, dir: 1},
    ];

    var moveNote = function (note) {
        if (note.theta < -0.3 && note.dir == -1) {
            note.dir = 1;
        } else if (note.theta > 0.3 && note.dir == 1) {
            note.dir = -1;
        }
        note.theta += note.dir / 20;
    }

    return {
        update: function () {
            moveFace();
            notes.each(moveNote);
        },
        draw: function () {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            drawRainbow();
            drawFace(faceLoc.x, faceLoc.y, 0.5);
            notes.each(drawNote);
        },
    };
}());

