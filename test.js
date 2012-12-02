//Test
window.addEventListener("load",function(){
    if(!window.File){
        result.innerHTML = "FILE API is not found";
        return;
    }

addEventListener("change", function(){
        var reader = new FileReader();
        document.getElementById("image").style.display = "block";

        var file = document.getElementById("imageFile").files[0];
        reader.readAsDataURL(file);
        document.getElementById("load_res").style.display = "block";
        
        document.getElementById("carea").style.display = "block";
        var canvas = document.getElementById('c1');
        if ( ! canvas || ! canvas.getContext ) { return false; }
        var ctx = canvas.getContext('2d');
        var canvasButtonElem = document.getElementById("canvasDraw");
        canvasButtonElem.style.display = "block";
        canvasButtonElem.addEventListener("click",function(){
            canvasButtonElem.style.display = "none";
            document.getElementById("image_area").style.display = "block";

            var saveElem = document.getElementById("save");
            saveElem.style.display = "block";
            saveElem.addEventListener("click",SaveData,true);

            var image = new Image();
            image.src = reader.result;
            image.onload = function(){
                
                ctx.drawImage(image,0,0);

                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);


                var canvasColorElem = document.getElementById("canvasColorChange");
                document.getElementById("filterPalette").style.display = "block";
                canvasColorElem.style.display = "block";
                canvasColorElem.addEventListener("click",function(){
                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    for(var i = 0, j = imageData.data.length; i < j; i ++) {
                        if(i % 4 !== 3) {
                            imageData.data[i] = 255 - imageData.data[i];
                        }
                    }

                    ctx.putImageData(imageData,0,0);
                    

                },true);

            document.getElementById("colorPalette").style.display = "block";
            document.getElementById("stamp").style.display = "block";


            Drawing(canvas,ctx);

            };
        },true);

    },true);

},true);

var LINE_COLOR = "black";
var STAMP_FLAG = "false";
function setLineColor(){
    var e = (window.event)? window.event : arguments.callee.caller.arguments[0] ;
    var self = e.target || e.srcElement;
    LINE_COLOR = self.style.color;
}

function getLineColor(){
    if(LINE_COLOR == 'black'){var colorParam = "black"; return colorParam;}
    if(LINE_COLOR == 'white'){var colorParam = "white"; return colorParam;}
    if(LINE_COLOR == 'red'){var colorParam = "rgba(255,0,0,1)"; return colorParam;}
    if(LINE_COLOR == 'green'){var colorParam = "rgba(0,255,0,1)"; return colorParam;}
    if(LINE_COLOR == 'blue'){var colorParam = "rgba(0,0,255,1)"; return colorParam;}
    if(LINE_COLOR == 'yellow'){var colorParam = "rgba(255,255,0,0.5)"; return colorParam;}
    return "black";
}

var nimgX;
var nimgY;
function StampFlag(){
            document.getElementById("carea").style.display = "block";
            var canvas = document.getElementById('c1');
            if ( ! canvas || ! canvas.getContext ) { return false; }
            var ctx = canvas.getContext('2d');

    STAMP_FLAG = "true";
    console.log(STAMP_FLAG);
    var image = new Image();
    image.src = "http://dp0091.lo.mixi.jp:8500/stamp001.png";
    var imgX = nimgX ? nimgX : 130;
    var imgY = nimgY ? nimgY : 40;
    console.log(imgX,imgY);
    image.onload = function(){
        ctx.drawImage(image,imgX,imgY);
        nimgX = imgX + 30;
        nimgY = imgY + 20;
        console.log(nimgX,nimgY);
    }
}

function Stamp(canvas,context){
    console.log(STAMP_FLAG);
    var can = canvas;
    var ctx = context;
    can.addEventListener("mouseclick", stamp, true);
    function stamp (e){
        e.preventDefauit();
        var color= "rgba(255,0,130,1)";
        var x = e.clientX;
        var y = e.clientY;
        ctx.strokeStyle = color;
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.stroke();
        ctx.closePath();
        STAMP_FLAG = "false";
    }
}


function Drawing(canvas,context){
    var drawFlag = false;
    var can = canvas;
    var ctx = context;
    var oldX = 0;
    var oldY = 0;
    can.addEventListener("mousemove",draw, true);
    can.addEventListener("mousedown", function(e){
        drawFlag = true;
        oldX = e.clientX;
        oldY = e.clientY;
    },false);
    can.addEventListener("mouseup", function(){
        drawFlag = false;
        STAMP_FLAG = false;
    },false);
    function draw (e) {
        if(!drawFlag) return;
        var color = getLineColor();
        console.log(color);
        var x = e.clientX;
        var y = e.clientY;
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(oldX, oldY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        oldX = x;
        oldY = y;
    }
    function stamp (e){
        if(!STAMP_FLAG) return;
        var color= "rgba(255,0,130,1)";
        var x = e.clientX;
        var y = e.clientY;
        ctx.strokeStyle = color;
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.stroke();
        ctx.closePath();
        STAMP_FLAG = "false";
    }
}

function SaveData(){
    var can = document.getElementById("c1");
    var ctx = can.getContext('2d');
    var imageData = ctx.getImageData(0, 0, can.width, can.height);
    ctx.putImageData(imageData,0,0);
    var img_src = can.toDataURL();
    document.getElementById("image_png").src = img_src;
}
