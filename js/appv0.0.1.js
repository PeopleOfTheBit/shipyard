$(document).ready(function(){
	app.c.init();
	app.v.init();
	app.c.listeners();
})
/////////////////////////////////////////////////////////////////////////////////

var app={m:{},v:{},c:{}};

/////////////////////////////////////////////////////////////////////////////////

app.m.sendToServer=false;

/////////////////////////////////////////////////////////////////////////////////

app.c.init=function(){
	app.m.metadata={"name":"Iconic Darwin","version":"0.0.1"};
	var b=app.c.bounds();
	app.m.genome={};
	app.m.genome.r=[];
	app.m.genome.rf=[];
	app.m.genome.color=[];
	app.m.genome.lw=[];
	app.m.genome.steps=[];
	app.m.genome.incrementMod=[];
	app.m.genome.n=[];
	app.m.genome.rotation=[];
	app.m.genome.fadeColor=[];
	app.m.genome.fadeRadius=[];
};

app.c.listeners=function(){
	$("#mitLicense").on("click",function(){
		$("#license").slideToggle();
	});


	$("input#clear").on("click",function(){
		$("div#icons").html("");
		for (var i=0;i<5;i++){
			var iconWidth=$("input[name=size]:checked").val();
			iconWidth=parseInt(iconWidth);
			app.v.icon("div#icons",iconWidth);
			//console.log(iconWidth);
		}
	});

/*	
	$(window).resize(function(){
		$("body").fadeOut(function(){
			$("body").html("");
			app.c.init();
			app.v.init();
			$("body").fadeIn();
		})
	});
*/
};

app.c.bounds=function(){	
	var b=app.m.bounds={};
	b.left=0;
	b.top=0;
	b.right=$(document).width();
	b.bottom=$(document).height();
	b.centerX=b.right/2;
	b.centerY=b.bottom/2;

	return b;
};

/////////////////////////////////////////////////////////////////////////////////

app.v.init=function(){
	app.v.style();
	var b=app.m.bounds;
	var d="";
	d+="<h1>Ship</h1>";
		/*
	d+="<div id='radios'><form action=''>";

		d+="<table><tr>";
			d+="<td><input type='radio' name='size' value='1024'><br>1024</td>";
			d+="<td><input type='radio' name='size' value='512' ><br>512</td>";
			d+="<td><input type='radio' name='size' value='144' checked><br>144</td>";
			d+="<td><input type='radio' name='size' value='72' ><br>72</td>";
		d+="</tr></table>";

	d+="</form></div>";
		*/
	d+="<div id='icons'></div>";
	d+="<div id='controlls'>";
		d+="<input type='button' value='more' id='clear'></input>";
	d+="</div>";
	d+="<p>click the icons you save below for a png version</p>"
	d+="<div id='saved'></div>";
	d+=davis.license();
	$("body").html(d);
	var iconWidth=$("input[name=size]:checked").val();
	iconWidth=parseInt(iconWidth);
	//console.log(iconWidth);
	for (var i=0;i<5;i++){
		app.v.icon("div#icons",iconWidth);
	}
};

app.v.icon=function(target,width){
	app.m.text="ship";
	var width=width || 144;
	var height=width;
	var target=target || "body";
	var id=davis.randomWord()+davis.random(100);
	var c=app.v.canvas(width,height,id);
	$(target).append(c);
	$("div#icons canvas#"+id).on("click",function(){
		
		//load a replacement
		$("div#saved").prepend(this);
		if ($("div#icons > canvas").size()<5){
			var iconWidth=$("input[name=size]:checked").val();
			iconWidth=parseInt(iconWidth);
			app.v.icon("div#icons",iconWidth);
		}

		//add an event listener to open the canvas image in a new window as a png
		$("div#saved canvas#"+id).on("click",function(){
		 	var dataURL = this.toDataURL();
		    if (!window.open(dataURL)) {
		        document.location.href = dataURL;
		    }
		});

		//send it to the database
		if (app.m.sendToServer===true){
			var dataURL=document.getElementById(id).toDataURL();
			$.ajax({
				  type: "POST",
				  url: "http://peopleofthebit.com/luke_davis/labs/ships/php/shipCreateRecord.php",
				  data: {image:dataURL}
				}).done(function(o) {
				  console.log('saved');
				});
			}
		
	});
	c=document.getElementById(id);
	var ctx=c.getContext("2d");
	app.v.ship({context:ctx,width:width,height:height});

};

app.v.ship=function(c){

	var ctx=c.context || false;
	var width=c.width || 100;
	var height=c.height || width;


	app.v.bilateral({context:ctx,width:width,height:height});

	var pattern=ctx.createPattern(ctx.canvas,"no-repeat");
	ctx.clearRect(0, 0, width, height);


	// mutate the average
	var ma=function(a,b,variance){
		var variance=variance || 0.2;
		var avg=(a+b)/2;
		avg= avg-(avg*variance)+davis.bell(2*avg*variance);
		if (avg<Math.min(a,b)){avg=Math.min(a,b);}
		if (avg>Math.max(a,b)){avg=Math.max(a,b);}
		return avg;
	};

	//mirror point
	var mp=function(x){
		return (width/2)-x+(width/2);
	};


	// g is for genome
	var g={};
	g.x0=0;
	g.x9=width/2;
	g.x4=ma((g.x9/2),g.x9,0.4);
	g.x6=ma(g.x4,g.x9);
	g.x7=ma(g.x6,g.x9);
	g.x8=ma(g.x7,g.x9,0.001);
	g.x5=ma(g.x0,g.x9,0.7);
	g.x1=ma(g.x0,g.x5,0.9);
	g.x3=ma(g.x1,g.x9,0.7);
	g.x2=ma(g.x1,g.x3);

	g.y0=0;
	g.y12=height;
	g.y4=ma(g.y0,g.y12,0.7);
	g.y2=ma(g.y0,g.y4);
	g.y3=ma(g.y2,g.y4);
	g.y1=ma(g.y0,g.y2);
	g.y7=ma(g.y4,g.y12,0.4);
	g.y6=ma(g.y7,g.y4);
	g.y9=ma(g.y7,g.y12,0.001);
	g.y8=ma(g.y7,g.y9,0.001);
	g.y11=ma(g.y7,g.y12,0.3);
	g.y5=ma(g.y0,g.y12,0.4);
	g.y10=ma(Math.max(g.y5,g.y7),g.y12,0.3);

	g.color=davis.randomColor("grey");
	ctx.lineWidth=Math.floor(width/70);
	ctx.strokeStyle="#000";

	// wings
	ctx.beginPath();
	ctx.lineTo(g.x1,g.y7);
	ctx.lineTo(g.x9,g.y6);
	ctx.lineTo(mp(g.x1),g.y7);
	ctx.lineTo(mp(g.x1),g.y8);
	ctx.lineTo(g.x9,g.y9);
	ctx.lineTo(g.x1,g.y8);
	ctx.lineTo(g.x1,g.y7);
	ctx.lineJoin='miter';
	ctx.fillStyle=davis.randomColor("grey");
	ctx.fill();
	ctx.stroke();

	davis.maybe(1,2,function(){ctx.fillStyle=g.color;});

	// abdomen
	ctx.beginPath();
	ctx.lineTo(g.x5,g.y4);
	ctx.lineTo(mp(g.x5),g.y4);
	ctx.lineTo(mp(g.x5),g.y11);
	ctx.lineTo(g.x5,g.y11);
	ctx.lineTo(g.x5,g.y4);
	ctx.lineJoin='miter';
	ctx.fill();
	davis.maybe(1,2,function(){
		ctx.fillStyle=pattern;
		ctx.fill();
		ctx.fillStyle=g.color;
	});
	ctx.stroke();

	//pods
	davis.maybe(2,3,function(){
		var podPattern=false;
		davis.maybe(1,2,function(){podPattern=true;});
		ctx.beginPath();
		ctx.lineTo(g.x2,g.y5);
		ctx.quadraticCurveTo(((g.x2+g.x3)/2),g.y5-(g.y5/10),g.x3,g.y5);
		ctx.lineTo(g.x3,g.y10);
		ctx.quadraticCurveTo(((g.x2+g.x3)/2),g.y10+(g.y5/10),g.x2,g.y10);
		ctx.lineTo(g.x2,g.y5);
		ctx.lineJoin='miter';
		ctx.fill();
		if (podPattern==true){
			ctx.fillStyle=pattern;
			ctx.fill();
			ctx.fillStyle=g.color;
		};
		ctx.stroke();


		ctx.beginPath();
		ctx.lineTo(mp(g.x2),g.y5);
		ctx.quadraticCurveTo(mp(((g.x2+g.x3)/2)),g.y5-(g.y5/10),mp(g.x3),g.y5);
		ctx.lineTo(mp(g.x3),g.y10);
		ctx.quadraticCurveTo(mp(((g.x2+g.x3)/2)),g.y10+(g.y5/10),mp(g.x2),g.y10);
		ctx.lineTo(mp(g.x2),g.y5);
		ctx.lineJoin='miter';
		ctx.fill();
		if (podPattern==true){
			ctx.fillStyle=pattern;
			ctx.fill();
			ctx.fillStyle=g.color;
		};
		ctx.stroke();
	});

	davis.maybe(1,2,function(){ctx.fillStyle=g.color;});

	// front
	ctx.beginPath();
	ctx.lineTo(g.x6,g.y1);
	ctx.quadraticCurveTo(g.x9,g.y0,mp(g.x6),g.y1);
	ctx.lineTo(mp(g.x4),g.y4);
	ctx.lineTo(g.x4,g.y4);
	ctx.lineTo(g.x6,g.y1);
	ctx.lineJoin='miter';
	ctx.fill();
	davis.maybe(1,2,function(){
		ctx.fillStyle=pattern;
		ctx.fill();
		ctx.fillStyle=g.color;
	});
	ctx.stroke();

	//cockpit
	ctx.beginPath();
	ctx.lineTo(g.x8,g.y2);
	ctx.lineTo(mp(g.x8),g.y2);
	ctx.lineTo(mp(g.x7),g.y3);
	ctx.lineTo(g.x7,g.y3);
	ctx.lineTo(g.x8,g.y2);
	ctx.lineJoin='miter';
	ctx.fillStyle="#eee";
	ctx.fill();
	ctx.stroke();

	// dorsal fin
	davis.maybe(6,7,function(){
		ctx.beginPath();
		ctx.lineTo(g.x7,g.y4);
		ctx.quadraticCurveTo(g.x9,g.y3,mp(g.x7),g.y4);
		ctx.lineTo(mp(g.x7),g.y4);
		ctx.lineTo(mp(g.x7),g.y11);
		ctx.quadraticCurveTo(g.x9,g.y9,g.x7,g.y11);
		ctx.lineTo(g.x7,g.y4);
		ctx.lineJoin='miter';
		ctx.fillStyle=g.color;
		ctx.fill();
	davis.maybe(1,2,function(){
		ctx.fillStyle=pattern;
		ctx.fill();
		ctx.fillStyle=g.color;
	});
		ctx.stroke();
	});

	//console.log(g);
	return g;
}

app.v.circle=function(c){
	var ctx= c.context || false;
	var x=c.x || 100;
	var y=c.y || x;
	var r=c.r || 10;
	var color=c.color || davis.randomColor("grey");
	var fadeColor=c.fadeColor || "rgba(0,0,0,0)";
	var fadeRadius=c.fadeRadius || Math.random();
	var cr=ctx.canvas.width/2;
	//console.log(cw);
	var gradient=ctx.createRadialGradient(cr,cr,(fadeRadius*cr),cr,cr,cr);
	gradient.addColorStop(0,color);
	gradient.addColorStop(1,fadeColor);
	var lineWidth=c.lineWidth || 1;
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	ctx.strokeStyle=gradient;
	ctx.lineWidth=lineWidth;

	ctx.stroke();


	return true;
};

app.v.bilateral=function(c){
	var ctx=c.context;
	var width=c.width || 144;
	var height=c.height || width;
	var color=davis.randomColor();
	var strokeStyle=davis.alpha(davis.randomColor("grey"),(0.5+(Math.random()/2)));

	var fillStyle=davis.alpha(color,0);
	var lineWidth=width/100;

	davis.maybe(9,10,function(){
		lineWidth=0;
		fillStyle=color;
	});

	for (var i=0;i<4;i++){
		davis.maybe(1,2,function(){

			var r=(width/20)+davis.random(width/10);

			var x=r+lineWidth+davis.random((width/2)-r-lineWidth);
			var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
			ctx.beginPath();
			ctx.strokeStyle=strokeStyle;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.lineWidth=lineWidth;
			ctx.fillStyle=fillStyle;
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			x=width/2+(width/2)-x;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.fillStyle=fillStyle;
			ctx.fill();
			ctx.stroke();
		});
	}
	for (var i=0;i<3;i++){
		davis.maybe(1,2,function(){
			//var lineWidth=1+davis.random(width/100);
			var r=(width/20)+davis.random(width/2);
			var x=width/2;
			var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
			ctx.beginPath();
			ctx.strokeStyle=strokeStyle;
			ctx.arc(x,y,r,0,2*Math.PI);
			ctx.lineWidth=lineWidth;
			ctx.fillStyle=fillStyle;
			davis.maybe(1,3,function(){ctx.fill();});
			ctx.stroke();
		})
	}
};

app.v.ngon=function(c){
	var n=c.n || 3;

	var ctx= c.context || false;
	var x=c.x || 100;
	var y=c.y || x;
	var r=c.r || 100;
	if (n%2==0){
		var rotation=360/(n*2)*davis.random(n*2);
	} 
	else {
		var rotation=90+(180*davis.random(2));
	};
	rotation=c.rotation || rotation;
	var color=c.color || davis.randomColor("grey");
	var lineWidth=c.lineWidth || 1;
	var fill=c.fill || davis.randcomColor();
	ctx.beginPath();
	for (var i=0;i<n+2;i++){
		var nx=geo.getPoint(x,y,r,rotation+(i*360/n)).x2;
		var ny=geo.getPoint(x,y,r,rotation+(i*360/n)).y2;
		ctx.lineTo(nx,ny);
	}
	ctx.lineJoin='miter';
	ctx.strokeStyle=color;
	ctx.lineWidth=lineWidth;
	ctx.fillStyle=fill;
	ctx.fill();
	ctx.stroke();
	return true;
};
app.v.canvas=function(w,h,id){
	var c="";
	c+="<canvas width='"+w+"' height='"+h+"' id='"+id+"'></canvas>";
	return c;
};

app.v.style=function(){
	davis.style("body",{
		"width":"100%",
		"margin":"0px",
		"padding":"0px",
		"text-align":"center",
		"background":"#ddd"
	});
	davis.style("canvas",{
		"margin":"20px",
		"cursor":"pointer"
	});
	davis.style("div",{
		"text-align":"center",
		"border":"1px solid #111",
		"margin":"20px"
	});
	davis.style("input[type=text]",{
		"font-size":"3em",
		"color":"#111",
		"text-align":"center",
		"margin-top":"30px"
	});
	davis.style("input[type=button]",{
		"font-size":"3em",
		"width":"100%",
		"margin":"0px",
		"cursor":"pointer",
		"background":"#EC1313",
		"color":"#fff"
	});
	davis.style("table",{
		"width":"100%",
		"table-layout":"fixed",
		"text-align":"center"
	});
	davis.style("input[type=radio]",{
		"margin-top":"20px",
		"width":"20px",
		"height":"20px"
	});
	davis.style("canvas",{
		"width":"100px",
		"height":"100px"
	});

};