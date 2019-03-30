Array.prototype.contains=function (ele) {
    for (var i=0;i<this.length;i++){
        if (this[i]==ele){
            return true;
        }
	}
	return false;
}
var editMode,editDirect,browserType;
var config={};
let devMode,
	extDisable=false,
	appType={},
	extID="bgjfekefhjemchdeigphccilhncnjldn";
	

//check browser
if(navigator.userAgent.toLowerCase().indexOf("firefox")!=-1){
	browserType="fx";
}else if(navigator.userAgent.toLowerCase().indexOf("edge")!=-1){
	browserType="msg";
}else{
	browserType="cr";
}
if(browserType!="cr"){
	chrome=browser;
}

//extID=chrome.runtime.id;

var sue={
	cons:{
		fix_linux_value:false,
		fix_linux_timer:null,
		os:"win",
		drginbox:true
	},
	apps:{
		enable:false,
	},
	resetConsoleLog:function(){
		if(devMode){

		}else{
			console.log=function(){return;}
		}
	},
	init:function(){
		if(!devMode){console.log=function(){return;}}
		sue.initHandle();
		sue.uistyle={};
		sue.uistyle.mges=[];
		var _uimges=["direct","tip","note"];
		for(var i=0;i<_uimges.length;i++){
			if(config.mges.ui[_uimges[i]].enable){
				sue.uistyle.mges.push(config.mges.ui[_uimges[i]].style);
			}else{
				sue.uistyle.mges.push("none");
			}
		}
	},
	initHandle:function(){
		if(config.general.fnswitch.fntouch){
			document.addEventListener("touchstart",this.handleEvent,false);
			document.addEventListener("touchmove",this.handleEvent,false);
			document.addEventListener("touchend",this.handleEvent,false);
		}
		if(config.general.fnswitch.fnmges||config.general.fnswitch.fnrges||config.general.fnswitch.fnwges){
			console.log("initHandle")
			document.addEventListener("mousedown",this.handleEvent,false);
			document.addEventListener("mouseup",this.handleEvent,false);
			document.addEventListener("mousemove",this.handleEvent,false);
			document.addEventListener("mouseover",this.handleEvent,false);
			document.addEventListener("contextmenu",this.handleEvent,false);
		}
		if(config.general.fnswitch.fndrg||config.general.fnswitch.fnsdrg){
			window.addEventListener("dragstart",this.handleEvent,false);
			window.addEventListener("drag", this.handleEvent,false);
			window.addEventListener("dragover",this.handleEvent,false);
			window.addEventListener("dragend",this.handleEvent,false);
		}
		// if(config.general.settings.clickcancel){
		// 	window.addEventListener("mouseclick",this.handleEvent,false);
		// }
		if(config.general.settings.esc){
			window.addEventListener("keydown",this.handleEvent,false);
		}
		if(config.general.fnswitch.fnrges||config.drg.settings.clickcancel){
			document.addEventListener("click",this.handleEvent,false);
		}
		if(config.general.fnswitch.fnwges){
			//window.addEventListener("mousewheel",this.handleEvent,false);
			window.addEventListener("wheel",this.handleEvent,false);
		}
	},
	initHandle2:function(){
		//document.addEventListener("mousedown",this.handleEvent,false);
		//sue.document.addEventListener("mouseup",this.handleEvent,false);
		sue.document.addEventListener("mousemove",this.handleEvent,false);
		sue.document.addEventListener("mouseover",this.handleEvent,false);
		sue.document.addEventListener("contextmenu",this.handleEvent,false);
	},
	handleEvent:function(e){
		switch(e.type){
			case"touchstart":
				if(!config.general.fnswitch.fntouch){return;}
				if(e.touches.length!=1){
					sue.drawing?sue.clearUI():null;
					break;
				}else{
					sue.lineDrawReady_touch(e,"touch");
				}
				break;
			case"touchmove":
				if(sue.drawing&&e.touches.length==1){
					sue.touchMove(e);
				}else{
					sue.clearUI();
				}
				break;
			case"touchend":
				sue.touchEnd(e);
				break;
			case"wheel":
				if(!extDisable&&config.general.fnswitch.fnwges&&(e.buttons==1||e.buttons==2)){
					sue.inWges=true;
					sue.clearUI();//clear mouse gesture
					var sendValue={
						button:e.button,
						buttons:e.buttons,
						wheelDelta:e.deltaY
					}

					chrome.runtime.sendMessage(extID,{type:"action_wges",sendValue:sendValue,selEle:sue.selEle},function(response){
						// if(response.name=="scroll"){
						// 	console.log("scroll")
						// 	e.preventDefault();
						// }
					})
					e.preventDefault();
				}
				break;
			case"click":
				if(sue.inRges){
					e.preventDefault();
					if(browserType=="fx"&&e.button==2){
						sue.inRges=true;//fix firefox, it is click before contextmenu
					}else{
						sue.inRges=false;
					}
				}
				if(sue.inWges){
					e.preventDefault();
					if(browserType=="fx"&&e.button==2){
						sue.inWges=true;
					}else{
						sue.inWges=false;//fix firefox, it is click before contextmenu
					}
				}
				if(sue.inDrg&&config.drg.settings.clickcancel){console.log("cancel");sue.break=true;sue.stopMges(e);}
				break;
			case"keydown":
				console.log(e.keyCode)
				if(e.keyCode==27){
					sue.break=true;
					sue.stopMges(e);
					//sue.timeout_nomenu=true;
				}
				break;
			case"mousedown":
				if(!extDisable
					&&config.general.fnswitch.fnmges
					&&e.buttons==config.mges.settings.model
					&&!e[config.mges.settings.holdkey+"Key"]){
						//console.log("mousedown");
						sue.lineDrawReady(e,"mges");
				}
				//fix rges mouseup bug
				if(!extDisable&&config.general.fnswitch.fnrges){
					console.log(e.buttons);
					sue.cons.rges_btn=e.button;
				}
				break;
			case"mouseup":
				//console.log(e)
				if((e.button==1&&config.mges.settings.model==4)
					||(e.button==2&&e.button==config.mges.settings.model&&(config.general.linux.cancelmenu&&sue.cons.os!="win"))){
					if(sue._dirArray&&sue.drawing){
						sue.stopMges(e);
					}
					sue.clearUI();
					sue.drawing=false;
					sue._lastX=e.clientX;
					sue._lastY=e.clientY;
				}
				if(!extDisable&&config.general.fnswitch.fnrges&&(e.buttons==1||e.buttons==2)&&(e.button==0||e.button==2)){
					console.log(e.button+"/"+e.buttons+"/"+sue.cons.rges_btn)
					if(e.button!=sue.cons.rges_btn){break;}//fix mouseup bug
					sue.inRges=true;
					var sendValue={
						buttons:e.buttons
					}
					chrome.runtime.sendMessage(extID,{type:"action_rges",sendValue:sendValue,selEle:sue.selEle},function(response){})
				}
				break;
			case"contextmenu":
				//console.log("contextmenu")
				if(config.general.linux.cancelmenu
					&&sue.cons.os!="win"){
						//fix mges
						if(config.general.fnswitch.fnmges&&!sue.cons.fix_linux_value&&config.mges.settings.model==2){
							e.preventDefault();
						}

						//fix rges
						if(config.general.fnswitch.fnrges&&!sue.cons.fix_linux_value&&config.rges.actions[1].name!="none"){
							e.preventDefault();
						}

						//fix wges
						if(config.general.fnswitch.fnwges&&!sue.cons.fix_linux_value&&!(config.wges.actions[2].name=="none"&&config.wges.settings[3].name=="none")){
							e.preventDefault();
						}

						sue.cons.fix_linux_value=true;
						window.clearTimeout(sue.cons.fix_linux_timer);
						sue.cons.fix_linux_timer=window.setTimeout(function(){sue.cons.fix_linux_value=false;},500)
						break;
				}else{//all for win
					if(sue._dirArray&&sue.drawing){
						sue.stopMges(e);
					}
					if(sue.drawing&&config.mges.settings.model==2){
						//e.preventDefault();
						sue.clearUI();
						sue.drawing=false;
						sue._lastX=e.clientX;
						sue._lastY=e.clientY;					
					}

					//fix wges
					if(sue.inWges){
						sue.inWges=false;
						e.preventDefault();
					}
					//fix rges
					if(sue.inRges){
						sue.inRges=false;
						e.preventDefault();
					}
					//e.preventDefault();
				}
				//none popup menu by timeout
				if(config.general.settings.timeout_nomenu&&sue.timeout_nomenu){
					sue.timeout_nomenu=false;
					e.preventDefault();
				}
				//fix switchtab by rges or wges
				console.log(sue.cons.switchtab)
				if(sue.cons.switchtab&&sue.cons.switchtab.contextmenu){
					e.preventDefault();
					sue.cons.switchtab.contextmenu=false;
				}
				
				break;
			case"mousemove":
				//console.log(sue.drawing)
				if(sue.drawing&&e.buttons==config.mges.settings.model){
					console.log("move")
					sue.lineDraw(e);
				}
				break;
			case"dragstart":
				//console.log("dragstart")
				//console.log(e.target.draggable)
				if(!extDisable
					&&((config.general.fnswitch.fndrg&&!e[config.drg.settings.holdkey+"Key"])
										||(config.general.fnswitch.fnsdrg&&!e[config.sdrg.settings.holdkey+"Key"]))){
					sue.lineDrawReady(e,config.general.fnswitch.fndrg?"drg":"sdrg");
					
					sue.inDrg=true;
				}
				break;
			case"dragover":
				//console.log("dragover")
				if(sue.drawing){
					sue.lineDraw(e,sue.drawType[0]);
					if(sue.drawType[0]=="drg"&&config[sue.drawType[0]].ui.tip.type=="follow"){
						sue.uiPos(e);
					}
					if(config[sue.drawType[0]].settings.drgcursor){
						e.dataTransfer.effectAllowed="move"
						e.dataTransfer.dropEffect="move";
						e.preventDefault();						
					}
					//drag to text box, cancel
					//console.log(sue.cons.drginbox)
					if(!sue.cons.drginbox&&config[sue.drawType[0]].settings.drgtobox&&e.target&&e.target.type&&(e.target.type=="textarea"||e.target.type=="text")){
						sue.break=true;
						sue.stopMges(e);
					}
					// if(config[sue.drawType[0]].settings.drgtobox&&e.path[0]&&e.path[0].type&&(e.path[0].type=="textarea"||e.path[0].type=="text")){
					// 	sue.break=true;
					// 	sue.stopMges(e);
					// }
				}
				break;
			case"dragend":
				// var test=function(e){
				// 	console.log("drag")
				// 	if(e.keyCode==27){
				// 		sue.break=true;
				// 		sue.stopMges(e);
				// 		sue.timeout_nomenu=true;
				// 	}
				// }
				// document.addEventListener("keydown",test,false)

				if(sue._dirArray&&sue.drawing){
					sue.stopMges(e);
				}
				sue.drawing=false;
				sue._lastX=e.clientX;
				sue._lastY=e.clientY;
				sue.inDrg=false;
				break;
		}
	},
	regURL:function(txt){
		var reg=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i; 
		return reg.test(txt.trim());
	},
	lineDrawReady_touch:function(e,type){
		e=e.targetTouches?e.targetTouches[0]:e;

		sue._lastX=e.clientX;
		sue._lastY=e.clientY;
		sue._startX=e.clientX;
		sue._startY=e.clientY;
		sue._dirArray="";
		sue.drawing=true;

		sue.selEle={};
		sue.selEle.txt=window.getSelection().toString();
		sue.selEle.lnk=e.href||e.target.href;
		sue.selEle.img=sue.selEle.img?sue.selEle.img:e.target.src;
		sue.selEle.str=e.target.innerText;
		sue.startEle=e.target;

		//txt to url
		if(config[type].settings.txttourl&&sue.regURL(sue.selEle.txt)){
			sue.selEle.lnk=sue.selEle.txt;
		}


		sue.window=window;
		sue.document=window.document.documentElement;
		sue.drawType=["touch","actions"];
		var _uiarray=["direct","tip","note","allaction"];
		var _uiset=[];
		for(var i=0;i<_uiarray.length;i++){
			if(config[sue.drawType[0]].ui&&config[sue.drawType[0]].ui[_uiarray[i]].enable){
				sue.UI(config[sue.drawType[0]].ui[_uiarray[i]].style);
				//sue.UI(config.mges.ui[_uiarray[i]].style)
			}
		}
	},
	touchMove:function(e){
		var x=e.targetTouches[0].clientX;
		var y=e.targetTouches[0].clientY;
		var dx=Math.abs(x-sue._lastX);
		var dy=Math.abs(y-sue._lastY);
		var dz=Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		//console.log(dx+"/"+dy+"/"+dz)
		if(dz<1){return}
		sue.uiPos(e);

		//return;
		//console.log(sue.drawType[0])
		//sue.ui_line(e)
		(config[sue.drawType[0]].ui.line.enable||editMode)?sue.ui_line(e):null;
		if(dx<config.general.settings.minlength
			&&dy<config.general.settings.minlength){
			return;
		}

		var dir;
		dir=dx>dy?(x<sue._lastX?"L":"R"):(y<sue._lastY?"U":"D");
		//console.log(dir)   	



		var lastDir=sue._dirArray.substr(sue._dirArray.length-1,1);
		if(dir!=lastDir){
			sue._dirArray+=dir;
			//show direct
			sue.drawType[0]!="sdrg"&&config[sue.drawType[0]].ui.direct.enable?sue.ui_direct(e):null;
			//get tip
			//sue.drawType[0]!="sdrg"&&(config[sue.drawType[0]].ui.tip.enable||config[sue.drawType[0]].ui.note.enable)?sue.sendDir(sue._dirArray,"gettip",e):null;

			//get tip
			(config[sue.drawType[0]].ui.tip.enable||config[sue.drawType[0]].ui.note.enable)?sue.sendDir(sue._dirArray,"gettip",e):null;
		}
		//timeout
		if(config.general.settings.timeout){
			if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
			sue.timeout=window.setTimeout(function(){
				//console.log("timeou")
				sue.break=true;
				sue.clearUI();
				//sue.timeout_nomenu=true;
			},config.general.settings.timeoutvalue)
		}

		sue._lastX=e.targetTouches[0].clientX;
		sue._lastY=e.targetTouches[0].clientY;
		//console.log(sue._dirArray)
	},
	touchEnd:function(e){
		console.log(e);
		console.log("fun_name:"+arguments.callee.name);
		if(!sue._dirArray){return;}
		if(sue.break){
			sue.clearUI();
			sue.break=false;
			return;
		}
		sue.clearUI();
		if(editMode){
			editDirect=sue._dirArray;
			var getele=function(ele){
				if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
					return ele;
				}else{
					return getele(ele.parentNode);
				}
			}
			var boxOBJ=getele(document.querySelector(".su_app_test"));
			boxOBJ.querySelector(".testbox").innerText=sue._dirArray;
		}else{
			sue.sendDir(sue._dirArray,"action",e);
		}	
		sue.drawing=false;
		if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
		sue._dirArray="";
		//sue.sendDir(sue._dirArray,"action",e);

		return;
		console.log("stop")
		if(sue.break){
			sue.clearUI();
			sue.break=false;
			return;
		}
		sue.clearUI();
		if(editMode){
			editDirect=sue._dirArray;
			var getele=function(ele){
				if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
					return ele;
				}else{
					return getele(ele.parentNode);
				}
			}
			var boxOBJ=getele(document.querySelector(".su_app_test"));
			boxOBJ.querySelector(".testbox").innerText=sue._dirArray;
		}else{
			sue.sendDir(sue._dirArray,"action",e);
		}
		
		if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
		e.preventDefault();
		sue._dirArray="";
		sue.drawing=false;
	},
	lineDrawReady:function(e,type){
		console.log("lineDrawReady");
		console.log(e.target)
		//disable drag ,when draggable=true
		if(config[type].settings.draggable&&e.target.getAttribute&&(e.target.getAttribute("draggable")=="true")){return;}
		sue._lastX=e.clientX;
		sue._lastY=e.clientY;
		sue._startX=e.clientX;
		sue._startY=e.clientY;
		sue._dirArray="";
		sue.drawing=true;
		sue.cons.drginbox=false;//drag to box

		//timeout
		if(config.general.settings.timeout){
			if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
			sue.timeout=window.setTimeout(function(){
				sue.break=true;
				sue.clearUI();
			},config.general.settings.timeoutvalue)
		}

		sue.selEle={};
		if(type=="drg"||type=="sdrg"){
			console.log(e)
			switch(e.target.nodeType){
				case 3:
					//sue.drawType=["drg","tdrg"]
					sue.drawType=[type,"t"+type]
					break;
				case 1:
					if(e.target.src){
						sue.drawType=[type,"i"+type]//["drg","idrg"];
						sue.selEle.img=e.target.src
					}else if(e.target.href){
						if(config[type].settings.drgimg&&e.target.firstElementChild&&e.target.firstElementChild.nodeType==1&&e.target.firstElementChild.src){
							sue.drawType=[type,"i"+type]//["drg","idrg"];
							sue.selEle.img=e.target.firstElementChild.src;
						}else{
							sue.drawType=[type,"l"+type]//["drg","ldrg"];
						}
					}else{
						sue.drawType=[type,"t"+type]//["drg","tdrg"];
					}
					break;
			}
			//enable drag in text box
			if(!config[type].settings.drgbox){
				if(e.button==0&&e.target.tagName&&((e.target.tagName.toLowerCase()=="input"&&e.target.type=="text")||e.target.tagName.toLowerCase()=="textarea")){
					sue.drawing=false;
				}
			}else{
				if(e.button==0&&e.target.tagName&&((e.target.tagName.toLowerCase()=="input"&&e.target.type=="text")||e.target.tagName.toLowerCase()=="textarea")){
					sue.cons.drginbox=true;
				}
			}
		}else if(type=="mges"){
			console.log(sue)
			sue.drawType=["mges","actions"];
		}
		console.log(sue.drawType)

		//sue.selEle={};
		sue.selEle.txt=window.getSelection().toString();
		sue.selEle.lnk=e.href||e.target.href;
		sue.selEle.img=sue.selEle.img?sue.selEle.img:e.target.src;
		sue.selEle.str=e.target.innerText;
		sue.startEle=e.target;

		//txt to url for mges
		if(type=="mges"&&config.mges.settings.txttourl&&sue.regURL(sue.selEle.txt)){
			sue.selEle.lnk=sue.selEle.txt;
		}

		//txt to url for drag
		if(type!="mges"&&((config.general.fnswitch.fnsdrg&&config.sdrg.settings.drgurl)||(config.general.fnswitch.fndrg&&config.drg.settings.drgurl))){
			if(sue.regURL(sue.selEle.txt)){
				sue.drawType=[type,"l"+type];
				sue.selEle.lnk=sue.selEle.txt;
			}
		}

		var ele=e.target;
		var getParent=function(win){
			if(win.parent&&win.parent!=win){
				return arguments.callee(win.parent);
			}else{
				return win
			}
		}
		t=getParent(window);
		sue.window=t;
		sue.document=t.document.documentElement;
		sue.initHandle2();

		//drag fn switch
		if(sue.drawType[1]==("t"+type)&&!config[type].settings.txt){
			sue.drawing=false;
		}
		if(sue.drawType[1]==("l"+type)&&!config[type].settings.lnk){
			sue.drawing=false;
		}
		if(sue.drawType[1]==("i"+type)&&!config[type].settings.img){
			sue.drawing=false;
		}

		//sue.clearUI();
		var _uiarray=["direct","tip","note","allaction"];
		var _uiset=[];
		for(var i=0;i<_uiarray.length;i++){
			if(config[sue.drawType[0]].ui&&config[sue.drawType[0]].ui[_uiarray[i]].enable){
				sue.UI(config[sue.drawType[0]].ui[_uiarray[i]].style);
			}
		}
		console.log(sue.drawing)
		return
	},
	lineDraw:function(e,type){
		//console.log("lineDraw")
		var x=e.clientX;
		var y=e.clientY;
		var dx=Math.abs(x-sue._lastX);
		var dy=Math.abs(y-sue._lastY);
		var dz=Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

		if(dz<1){return}
		sue.uiPos(e)
		sue.drawType[0]!="sdrg"&&(config[sue.drawType[0]].ui.line.enable||editMode)?sue.ui_line(e):null;
		if(dx<config.general.settings.minlength
			&&dy<config.general.settings.minlength){
			return;
		}

		var dir;
		if(sue.drawType[0]=="sdrg"){
			var angle=180/(Math.PI/Math.acos(dy/dz));

			if(angle<=22.5&&dx<dy&&y<sue._lastY){
				dir="U"
			}else if(angle<=22.5&&dx<dy&&y>sue._lastY){
				dir="D"
			}else if(angle>67.5&&angle<=90&&dx>dy&&x>sue._lastX){
				dir="R"
			}else if(angle>67.5&&angle<=90&&dx>dy&&x<sue._lastX){
				dir="L"
			}else if(angle>22.5&&angle<=67.5&&y<sue._lastY&&x<sue._lastX){
				dir="l"
			}else if(angle>22.5&&angle<=67.5&&y<sue._lastY&&x>sue._lastX){
				dir="u"
			}else if(angle>22.5&&angle<=67.5&&y>sue._lastY&&x>sue._lastX){
				dir="r"
			}else if(angle>22.5&&angle<=67.5&&y>sue._lastY&&x<sue._lastX){
				dir="d"
			}
			//console.log(angle+"/"+dir);
		}else{
			// if(dx>dy ){
			// 	dir=x<sue._lastX?"L":"R";
			// }else{
			// 	dir=y<sue._lastY?"U":"D";
			// }
			dir=dx>dy?(x<sue._lastX?"L":"R"):(y<sue._lastY?"U":"D");    	
		}



		var lastDir=sue._dirArray.substr(sue._dirArray.length-1,1);
		if(dir!=lastDir){
			sue._dirArray+=dir;
			//show direct
			sue.drawType[0]!="sdrg"&&config[sue.drawType[0]].ui.direct.enable?sue.ui_direct(e):null;
			//get tip
			sue.drawType[0]!="sdrg"&&(config[sue.drawType[0]].ui.tip.enable||config[sue.drawType[0]].ui.note.enable)?sue.sendDir(sue._dirArray,"gettip",e):null;
		}
		//timeout
		if(config.general.settings.timeout){
			if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
			sue.timeout=window.setTimeout(function(){
				sue.break=true;
				sue.clearUI();
				sue.timeout_nomenu=true;
			},config.general.settings.timeoutvalue)
		}
		sue._lastX=e.clientX;
		sue._lastY=e.clientY;
	},
	UI:function(style){
		console.log(style)
		var domui=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+style+"]");
		if(!domui){
			domui=document.createElement("div");
			domui.dataset.suui="uibox";
			domui.dataset.sustyle=style;
			domui.style.cssText+=
				"position:fixed;text-align:right;"
				+"z-index:"+parseInt((new Date())/1000);
			let objStyle={
				"leftbottom":"left:0;bottom:0px;",
				"lefttop":"left:0;top:0px;",
				"righttop":"right:0;top:0px;",
				"hover":"right:0px;bottom:0;",
				"top":"top:0;",
				"ui_bottom":"bottom:0"
			}
			domui.style.cssText+=objStyle[style];
			sue.document.appendChild(domui)
		}
	},
	ui_line:function(e){
		if(!sue.document.querySelector("div[data-suui=line]")){
			var svgdiv=this.svgdiv= document.createElement("div");
				svgdiv.dataset.suui="line";
				svgdiv.style.cssText+="position:fixed;left:0;top:0;display:block;background:transparent;border:none;"+
					"width:"+sue.window.innerWidth+"px;"+
					"height:"+sue.window.innerHeight+"px;"+
					"z-index:"+parseInt((new Date().getTime())/1000);
			var SVG = 'http://www.w3.org/2000/svg';
			var svgtag= sue.svgtag= document.createElementNS(SVG, "svg");
				svgtag.style.cssText+="width:"+sue.window.innerWidth+"px;"+"height:"+sue.window.innerHeight+"px;";
			var polyline = document.createElementNS(SVG, 'polyline');
				polyline.style.stroke=config[sue.drawType[0]].ui.line.color;
				polyline.style.strokeOpacity=config[sue.drawType[0]].ui.line.opacity/100;
				polyline.style.strokeWidth=config[sue.drawType[0]].ui.line.width;
				polyline.style.fill="none";
				this.polyline = polyline;
				
			svgtag.appendChild(polyline);
			svgdiv.appendChild(svgtag);
			sue.document.appendChild(svgdiv);
		}
		//console.log(sue.svgtag)
		e=e.targetTouches?e.targetTouches[0]:e;
		this.startX = e.clientX;
		this.startY = e.clientY;
		if(sue.svgtag){
			var p =sue.svgtag.createSVGPoint();
			p.x = this.startX;
			p.y = this.startY;
			this.polyline.points.appendItem(p);
		}else{
			return
		}
	},
	ui_direct:function(e){
		if(!config[sue.drawType[0]].ui.direct.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.direct.style+"]");
		var ui_dir=uidom.querySelector("div[data-suui=dir]");
		if(ui_dir){
			var _img=document.createElement("img");
				_img.src=chrome.extension.getURL("")+"image/"+"direct.png";
				_img.style.cssText+="float:left;"
					+"height:"+config[sue.drawType[0]].ui.direct.width+"px;"
					+"transform:rotate(+"+sue.directimg(sue._dirArray[sue._dirArray.length-1])+");";
			ui_dir.appendChild(_img);
		}else{
			ui_dir=document.createElement("div");
			ui_dir.dataset.suui="dir";
			ui_dir.style.cssText+=
				"display:inline-block;text-align:center;border-radius:2px;padding:0 5px;"+
				"background-color:"+config[sue.drawType[0]].ui.direct.color+" !important;"+
				"opacity:"+config[sue.drawType[0]].ui.direct.opacity/100;
			ui_dir.appendChild(sue.domDir2(sue._dirArray[sue._dirArray.length-1]));
			uidom.appendChild(ui_dir);

			var _br=document.createElement("br");
				_br.style.cssText+="/*display:none;*/";
			uidom.appendChild(_br);
		}
	},
	ui_tip:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.tip.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.tip.style+"]");
		if(!uidom){return}
		var _dom=uidom?uidom.querySelector("div[data-suui=tip]"):null;
		if(!_dom){
			var _dom=document.createElement("div");
				_dom.dataset.suui="tip";
				_dom.style.cssText+="display:inline-block;padding:2px 5px 2px 5px;border-radius: 3px;font-family: arial,sans-serif !important;"
					+"background-color:"+config[sue.drawType[0]].ui.tip.bgcolor+";"
					+"color:"+config[sue.drawType[0]].ui.tip.color+";"
					+"font-size:"+config[sue.drawType[0]].ui.tip.width+"px;"
					+"opacity:"+config[sue.drawType[0]].ui.tip.opacity/100+";"
			uidom.appendChild(_dom);
			var _br=document.createElement("br");
				_br.style.cssText+="/*display:none;*/";
			uidom.appendChild(_br);
		}
		if(confOBJ.tip){
			var domdir=sue.domDir(config[sue.drawType[0]].ui.tip.width);
			_dom.innerHTML=(domdir+confOBJ.tip);
			_dom.style.cssText+="display:inline-block;";
		}else{
			_dom.innerHTML="";
			_dom.style.cssText+="display:none;";
		}
	},
	ui_note:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.note.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.note.style+"]");
		var _dom=uidom.querySelector("div[data-suui=note]");
		if(!_dom){
		    _dom=document.createElement("div");
			_dom.dataset.suui="note";
			_dom.style.cssText+="font-family: arial,sans-serif !important;font-style: italic;/*position:fixed;*/"+
			"color:"+config[sue.drawType[0]].ui.note.color+";"+
			"font-size:"+config[sue.drawType[0]].ui.note.width+"px;"+
			"opacity:"+config[sue.drawType[0]].ui.note.opacity/100+";"
			uidom.appendChild(_dom);
			var _br=document.createElement("br");
			uidom.appendChild(_br);
		}
		if(confOBJ.note&&confOBJ.note.type&&confOBJ.note.value){
			_dom.style.cssText+="display:inline-block;";
			_dom.innerText=confOBJ.note.value;
		}else{
			_dom.style.cssText+="display:none;";
			_dom.innerText="";
			return;
		}
	},
	ui_allaction:function(confOBJ,e){
		if(!config[sue.drawType[0]].ui.allaction.enable){return;}
		var uidom=sue.document.querySelector("div[data-suui=uibox][data-sustyle="+config[sue.drawType[0]].ui.allaction.style+"]");
			
		var _dom=uidom.querySelector("div[data-suui=allaction]");
		if(!_dom){
		    _dom=document.createElement("div");
			_dom.dataset.suui="allaction";
			_dom.style.cssText+="font-family: arial,sans-serif !important;text-align:left;padding: 5px 20px;border-radius: 2px;"
				+"color:"+config[sue.drawType[0]].ui.allaction.color+";"
				+"background-color:"+config[sue.drawType[0]].ui.allaction.bgcolor+";"
				+"font-size:"+config[sue.drawType[0]].ui.allaction.width+"px;"
				+"opacity:"+config[sue.drawType[0]].ui.allaction.opacity/100+";"
			uidom.appendChild(_dom);
			//uidom.appendChild(document.createElement("br"));
		}else{
			_dom.innerHTML="";
		}
		if(confOBJ.allaction&&confOBJ.allaction.length>0){
			for(var i=0;i<confOBJ.allaction.length;i++){
				var _img="";
				for(var ii=0;ii<confOBJ.allaction[i].direct.length;ii++){
					_img+="<img src='"+chrome.extension.getURL("")+"image/"+"direct.png"+"' style='"
						//+"float:left;"
						+"vertical-align: text-top;"
						+"height:"+config[sue.drawType[0]].ui.allaction.width+"px;"
						+"transform:rotate("+sue.directimg(confOBJ.allaction[i].direct[ii])+")"
						+";'"
						+"'>";
				}
				var _acction=document.createElement("div");
					_acction.innerHTML=_img+"&nbsp;&nbsp;"+confOBJ.allaction[i].tip;
				_dom.appendChild(_acction);
			}
			_dom.style.cssText+="display:inline-block;";
		}else{
			_dom.innerHTML="";
			_dom.style.cssText+="display:none;";
		}
	},
	directimg:function(direct){
		var myDeg={L:"0deg",U:"90deg",R:"180deg",D:"270deg"};
		return myDeg[direct];
		//return "-webkit-transform:rotate(+"+myDeg[direct]+");";
	},
	domDir2:function(img){
		var domimg=document.createElement("img");
			domimg.src=chrome.extension.getURL("")+"image/"+"direct.png";
			domimg.style.cssText+="float:left;"
				+"height:"+config[sue.drawType[0]].ui.direct.width+"px;"
				+"vertical-align: text-top;"
				+"transform:rotate(+"+sue.directimg(img)+");";
		return domimg;
	},
	domDir:function(value){
		if(config[sue.drawType[0]].ui.tip.withdir){
			var domdir="";
			for(var i=0;i<sue._dirArray.length;i++){
				domdir+="<img src='"+chrome.extension.getURL("")+"image/"+"direct.png"+"' style='/*float:left;display:block;margin-top:5px;*/"
					+"vertical-align: text-top;"
					+"transform:rotate(+"+sue.directimg(sue._dirArray[i])+");"
					+"height: "+config[sue.drawType[0]].ui.tip.width+"px;"
					+"'>"
			}
			return domdir;		
		}else{
			return "";
		}
	},
	uiPos:function(e){
		let domUIs=sue.document.querySelectorAll("div[data-suui=uibox]"),
			i=0,domWidth,domHeight;
		e=e.targetTouches?e.targetTouches[0]:e;
		console.log(domUIs)
		for(i=0;i<domUIs.length;i++){
			if(["center","top","ui_bottom","left","right"].contains(domUIs[i].dataset.sustyle)){
				domWidth=window.getComputedStyle(domUIs[i]).width;
				domWidth=domWidth.substr(0,domWidth.length-2);
				domWidth=(window.innerWidth-domWidth)/2;
				domHeight=window.getComputedStyle(domUIs[i]).height;
				domHeight=domHeight.substr(0,domHeight.length-2);
				domHeight=(window.innerHeight-domHeight)/2;
			}
			switch(domUIs[i].dataset.sustyle){
				case"follow":
					domUIs[i].style.cssText+="left:"+(e.clientX+10)+"px;"
						+"top:"+(e.clientY+30)+"px"
					break;
				case"center":
					console.log("center")
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"top:"+domHeight+"px;";
					break;
				case"top":
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"top:0";
					break;
				case"ui_bottom":
					domUIs[i].style.cssText+="left:"+domWidth+"px;"
						+"bottom:-1px;";
					break;
				case"left":
					domUIs[i].style.cssText+="left:0px;"
						+"top:"+domHeight+"px;";
					break;
				case"right":
					domUIs[i].style.cssText+="right:0px;"
						+"top:"+domHeight+"px;";
					break;
			}
		}

		return;

		var uibox_follow=sue.document.querySelector("div[data-suui=uibox][data-sustyle=follow]"),
			uibox_center=sue.document.querySelector("div[data-suui=uibox][data-sustyle=center]"),
			uibox_bottom=sue.document.querySelector("div[data-suui=uibox][data-sustyle=ui_bottom]");

		var uibox_leftbottom=sue.document.querySelector("div[data-suui=uibox][data-sustyle=ui_leftbottom]");

		e=e.targetTouches?e.targetTouches[0]:e;

		uibox_follow?(uibox_follow.style.cssText+="left:"+(e.clientX+10)+"px;"+"top:"+(e.clientY+30)+"px"):null;
		if(uibox_center){
			var _width=window.getComputedStyle(uibox_center).width;
				_width=_width.substr(0,_width.length-2);
				_width=(window.innerWidth-_width)/2;
			var _height=window.getComputedStyle(uibox_center).height;
				_height=_height.substr(0,_height.length-2);
				_height=(window.innerHeight-_height)/2;
			uibox_center.style.cssText+=
				"left:"+_width+"px;"+
				"top:"+_height+"px;";
		}
		if(uibox_bottom){
			var _width=window.getComputedStyle(uibox_bottom).width;
				_width=_width.substr(0,_width.length-2);
				_width=(window.innerWidth-_width)/2;
			var _height=window.getComputedStyle(uibox_bottom).height;
				_height=_height.substr(0,_height.length-2);
				_height=(window.innerHeight-_height)/2;
			uibox_bottom.style.cssText+=
				"left:"+_width+"px;"/*+
				"top:"+_height+"px;";*/
		}
		// if(uibox_leftbottom){
		// 	var _width=window.getComputedStyle(uibox_bottom).width;
		// 		_width=_width.substr(0,_width.length-2);
		// 		_width=(window.innerWidth-_width)/2;
		// 	var _height=window.getComputedStyle(uibox_bottom).height;
		// 		_height=_height.substr(0,_height.length-2);
		// 		_height=(window.innerHeight-_height)/2;
		// 	uibox_bottom.style.cssText+=
		// 		"left:"+_width+"px;"+
		// 		"bottom:"+"1px; !important";
		// }
	},
	clearUI:function(){
		//return
		if(!sue.document){return;}
		sue.document.querySelector("div[data-suui=line]")?sue.document.querySelector("div[data-suui=line]").remove():null;
		var doms=sue.document.querySelectorAll("div[data-suui=uibox]");
		for(var i=0;i<doms.length;i++){
			if(doms[i]){doms[i].remove()}
		}
		// console.log(sue.drawing);
		sue.drawing=false;
	},
	stopMges:function(e){
		console.log("stop")
		if(sue.break){
			sue.clearUI();
			sue.break=false;
			return;
		}
		sue.clearUI();
		if(editMode){
			editDirect=sue._dirArray;
			var getele=function(ele){
				if(ele.tagName.toLowerCase()=="smartup"&&ele.classList.contains("su_apps")){
					return ele;
				}else{
					return getele(ele.parentNode);
				}
			}
			var boxOBJ=getele(document.querySelector(".su_app_test"));
			boxOBJ.querySelector(".testbox").innerText=sue._dirArray;
		}else{
			sue.sendDir(sue._dirArray,"action",e);
		}
		
		if(sue.timeout){window.clearTimeout(sue.timeout);sue.break=false;}
		e.preventDefault();
		sue._dirArray="";
		sue.drawing=false;
	},
	sendDir:function(dir,dirType,e){
		//console.log(sue.drawType)
		console.log(dirType)
		console.log({type:dirType,direct:dir,drawType:sue.drawType,selEle:sue.selEle})
		var returnValue;
		chrome.runtime.sendMessage(extID,{type:dirType,direct:dir,drawType:sue.drawType,selEle:sue.selEle},function(response){
			console.log(response)
  			returnValue=response;
  			sue.getedConf=returnValue;
  			switch(response.type){
  				case"tip":
  					console.log(response)
  					sue.ui_tip(response,e);
  					sue.ui_note(response,e);
  					sue.ui_allaction(response,e);
  					sue.uiPos(e);
  					break;
  				case"action":
  					switch(response.typeAction){
  						case"paste":
  							var clipOBJ=document.body.appendChild(document.createElement("textarea"));
							clipOBJ.focus();
							document.execCommand('paste', false, null);
							var clipData=clipOBJ.value;
							sue.startEle.value+=response.paste;
  							break;
  					}
  					break;
  			}
		});
	}
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse) {
	if(message.type=="set_confirm"){
		sendResponse({type:message.type,message:true});
		if(!confirm("You are try to close multiple tabs. Are you sure you want to continue?")){
			//sendResponse({type:message.type,message:true});
		}
	}
	if(message.type=="status"){
		sendResponse({type:message.type,message:true})
	}
	if(message.type=="icon"||message.type=="pop"){//icon action
		sue.selEle={};
		sue.selEle.txt=window.getSelection().toString();
		console.log(sue.selEle)
		sendResponse({type:"action_"+message.type,selEle:sue.selEle});
	}
	if(message.type=="extdisable"){
		extDisable=true;
	}
	if(message.type=="setapptype"){
		sue.appType[message.apptype]=true;
	}
	switch(message.type){
		case"fix_switchtab"://fix contextmenu from switchtab by rges or wges
			sue.cons.switchtab={};
			sue.cons.switchtab.contextmenu=true;
			sendResponse({type:message.type,message:true});
			break;
	}
});
chrome.runtime.sendMessage(extID,{type:"evt_getconf"},function(response){
	if(response){
		config=response.config;
		devMode=response.devMode;
		sue.cons.os=response.os;
		sue.init();
	}
});