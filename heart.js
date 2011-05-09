var cnv = document.getElementById("heart");
var ctx = cnv.getContext("2d");

cnv.width = 500;
cnv.height = 500;

ctx.clearRect(0, 0, 500, 500);

var start = {
    x: 250,
    y: 150,
};

var thick = {
    x: 200,
    y: 0,
}

var thin = {
    x: 20,
    y: 0,
}

var poke = {
    x: 251,
    y: 262,
    w: 20,
    h: 35,
}

ctx.strokeStyle = "#ff6677";
ctx.lineWidth = 22;
ctx.lineCap = "round";
ctx.save();
ctx.beginPath();
ctx.translate(250, 250);
ctx.rotate(Math.PI / 40);
ctx.translate(-250, -250);
ctx.moveTo(start.x, start.y);
ctx.bezierCurveTo(200, 20,
                  start.x - thick.x, 40,
                  start.x - thick.x, 160);
ctx.bezierCurveTo(start.x - thick.x, 300,
                  start.x - thin.x, 400,
                  250, 480);
ctx.bezierCurveTo(start.x + thin.x, 400,
                  start.x + thick.x, 300,
                  start.x + thick.x, 160);
ctx.bezierCurveTo(start.x + thick.x, 40,
                  300, 20,
                  start.x, start.y);
//ctx.lineTo(250, 480);
ctx.stroke();
ctx.closePath();
ctx.restore();

ctx.save();
ctx.strokeStyle = "#a62131";
ctx.beginPath();
ctx.translate(250, 250);
ctx.rotate(-Math.PI/40);
ctx.translate(-250, -250);
ctx.moveTo(poke.x, poke.y - poke.h/2);
ctx.bezierCurveTo(poke.x - poke.w/2, poke.y - poke.h/2,
                  poke.x - poke.w/2, poke.y + poke.h/2,
                  poke.x, poke.y + poke.h/2);
ctx.bezierCurveTo(poke.x + poke.w/2, poke.y + poke.h/2,
                  poke.x + poke.w/2, poke.y - poke.h/2,
                  poke.x, poke.y - poke.h/2);
ctx.stroke();
ctx.closePath();

