window.addEventListener("load",function(){
    if(!window.File){
        document.write("FILE API is not found");
        return;
    }

    var LINE_COLOR = "black";
    Canvas.can = document.getElementById('c1');
    Canvas.ctx = Canvas.can.getContext('2d');
    Canvas.imageData;
    Canvas.drawFlag = false;
    Canvas.pos = {x:0, y:0};
    Canvas.lastpos = {x:0, y:0};
    var CANVAS_MAX_WIDTH  = 500;
    var CANVAS_MAX_HEIGHT = 500;

    addEventListener("change", function(){
        var reader = new FileReader();
        var file = document.getElementById("imageFile").files[0];
        reader.readAsDataURL(file);
        
        var canvasButtonElem = document.getElementById("canvasDraw");
        canvasButtonElem.style.display = "block";
        canvasButtonElem.addEventListener("click",function(){
            this.style.display = "none";
            document.getElementById("imageArea").style.display = "block";
            document.getElementById("dummyImage").style.display = "block";
            document.getElementById("loadStr").style.display = "block";
            document.getElementById("cArea").style.display = "block";
            document.getElementById("saveButton").style.display = "block";
            var image = new Image();
            image.src = reader.result;
            image.onload = function(){
                document.getElementById("filterPalette").style.display = "block";
                document.getElementById("canvasColorChange").style.display = "block";
                document.getElementById("colorPalette").style.display = "block";
                Canvas.init(this);
            };
        },true);
    },true);

    //[参考] https://github.com/yutakikuchi/JS
    Canvas.init = function(uploadImg){
        var width = uploadImg.width;
        var height = uploadImg.height;

        Canvas.resize(width, height);
        Canvas.ctx.drawImage(uploadImg,0,0,Canvas.can.width, Canvas.can.height);

        var saveElem = document.getElementById("saveButton");
        saveElem.addEventListener("click",Canvas.save,true);

        var canvasColorElem = document.getElementById("canvasColorChange");
        canvasColorElem.addEventListener("click",Canvas.filter,true);

        addEventListener("mousemove",Canvas.drawLine, true);
        addEventListener("mousedown", Canvas.drawStart, false);
        addEventListener("mouseup", Canvas.drawStop, false);
    }

    //[参考] https://github.com/josefrichter/resize
    Canvas.resize = function (width, height){
        if (width > height) {
            if (width > CANVAS_MAX_WIDTH) {
                height = Math.round(height *= CANVAS_MAX_WIDTH / width);
                width = CANVAS_MAX_WIDTH;
            }
        } else {
            if (height > CANVAS_MAX_HEIGHT) {
                width = Math.round(width *= CANVAS_MAX_HEIGHT / height);
                height = CANVAS_MAX_HEIGHT;
            }
        }
        Canvas.can.width = width;
        Canvas.can.height= height;
    }

    Canvas.filter = function (){
        Canvas.imageData = Canvas.ctx.getImageData(0, 0, Canvas.can.width, Canvas.can.height);
        for(var i = 0, j = Canvas.imageData.data.length; i < j; i ++) {
            if(i % 4 !== 3) {
                Canvas.imageData.data[i] = 255 - Canvas.imageData.data[i];
            }
        }

        Canvas.ctx.putImageData(Canvas.imageData,0,0);
    }

    Canvas.setLineColor = function (){
        var e = (window.event)? window.event : arguments.callee.caller.arguments[0] ;
            var self = e.target || e.srcElement;
            LINE_COLOR = self.style.color;
    }

    Canvas.getLineColor = function (){
        if(LINE_COLOR == 'black'){var colorParam = "black"; return colorParam;}
        if(LINE_COLOR == 'white'){var colorParam = "white"; return colorParam;}
        if(LINE_COLOR == 'red'){var colorParam = "rgba(255,0,0,1)"; return colorParam;}
        if(LINE_COLOR == 'green'){var colorParam = "rgba(0,255,0,1)"; return colorParam;}
        if(LINE_COLOR == 'blue'){var colorParam = "rgba(0,0,255,1)"; return colorParam;}
        if(LINE_COLOR == 'yellow'){var colorParam = "rgba(255,255,0,0.5)"; return colorParam;}
        return "black";
    }

    Canvas.drawStart = function(e){
        Canvas.drawFlag = true;
        Canvas.lastpos = {x:e.clientX, y:e.clientY};
    }

    Canvas.drawStop = function(e){
        Canvas.drawFlag = false;
    }

    Canvas.drawLine = function(e){
        if(!Canvas.drawFlag) return;

        Canvas.pos = {x:e.clientX, y:e.clientY};

        Canvas.ctx.strokeStyle = Canvas.getLineColor();
        Canvas.ctx.lineWidth = 4;
        Canvas.ctx.beginPath();
        Canvas.ctx.moveTo(Canvas.lastpos.x, Canvas.lastpos.y);
        Canvas.ctx.lineTo(Canvas.pos.x, Canvas.pos.y);
        Canvas.ctx.stroke();
        Canvas.ctx.closePath();

        Canvas.lastpos = Canvas.pos;
    }

    Canvas.save = function(){
        Canvas.imageData = Canvas.ctx.getImageData(0, 0, Canvas.can.width, Canvas.can.height);
        Canvas.ctx.putImageData(Canvas.imageData,0,0);
        var img_src = Canvas.can.toDataURL();
        document.getElementById("pngImageArea").src = img_src;
    }
},true);
