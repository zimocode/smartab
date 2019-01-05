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
let st={
	init:function(){
		this.initHandle();
		this.setBingImage();
		this.setList();
	},
	initHandle:function(){
		document.addEventListener("DOMContentLoaded",this.handleEvent,false);
		window.addEventListener("resize",this.handleEvent,false);
	},
	handleEvent:function(e){
		switch(e.type){
			case"DOMContentLoaded":
				console.log("DOMContentLoaded");
				break;
			case"resize":
				console.log("resize");
				break;
		}
	},
	XHR:async function(url,method){
		method=method||"GET";
		return new Promise(function(resolve,reject){
			let xhr=new XMLHttpRequest();
			xhr.open(method,url);
			console.log(xhr);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					resolve(xhr.responseXML);
				}
			}
			xhr.send();
		});
	},
	setBingImage:function(){
		st.DBsave("get");
		st.XHR("https://bing.com/HPImageArchive.aspx?idx=0&n=1").then(function(responseXML){
			if(!responseXML){return;}
			let data={
				imageURL:"https://www.bing.com"+responseXML.querySelector("images>image>url").innerHTML,
				copyrightString:responseXML.querySelector("images>image>copyright").innerHTML,
				copyrightURL:responseXML.querySelector("images>image>copyrightlink").innerHTML
			}
			st.xhrImage(data);
		}).catch(function(){
			console.log("error")
		});
	},
	DBsave:function(method/*get or put*/,data){
		console.log("data");
		let request = indexedDB.open("st", 1),
			db;
		let setData=function(db){
			let put=function(db){
				console.log(method);
				let dbobj=db.transaction(["bg"], "readwrite").objectStore("bg");
				let addDB=dbobj.put({
					url:data.imageURL,
					base64:data.base64,
					copyrightString:data.copyrightString,
					copyrightURL:data.copyrightURL,
					id:0
				});
				setImage(data);
			}

			let get=function(db){
				let dbobj=db.transaction(["bg"], "readwrite").objectStore("bg");
				let dbget=dbobj.get(0);
				dbget.onsuccess=function(e){
					if(!e.target.result){return;}
					let data={
						imageURL:e.target.result.base64,
						copyrightString:e.target.result.copyrightString,
						copyrightURL:e.target.result.copyrightURL
					}
					setImage(data);
				}
			}
			let setImage=function(data){
				let dom=document.querySelector("homeimage"),
					domCopyright=document.querySelector("#copyright");
				dom.style.cssText+="background-image:url("+data.imageURL+");";
				domCopyright.href=data.copyrightURL;
				domCopyright.innerText=data.copyrightString;
				dom.style.cssText+="opacity:1;";
			}
			method=="get"?get(db):put(db);
		}
		request.onupgradeneeded = function(e){
			db=e.target.result;
			var objectStore = db.createObjectStore("bg", { keyPath: "id" });
			objectStore.transaction.oncomplete =function(event){
				setData(db);
			};
		};
		request.onsuccess=function(e){
			console.log("onsuccess");
			db=e.target.result;
			setData(db)
		}
	},
	xhrImage:function(data){
		var xhr = new XMLHttpRequest();
		xhr.responseType="blob";
		xhr.onreadystatechange=function(){
			if (xhr.readyState == 4){
				console.log(xhr.response);
				var reader = new FileReader();
				reader.readAsDataURL(xhr.response); 
				reader.onloadend = function(){
					data.base64=reader.result;
					st.DBsave("put",data);
				}
			}
		}
		xhr.open('GET',data.imageURL, true);
		xhr.send();
	},
	setList:function(){
		let dombox=document.querySelector("homelist>ul"),
			i=0;
		chrome.topSites.get(function(most){
			for(i=0;i<most.length;i++){
				var domLi=document.createElement("li"),
					domImg=document.createElement("img"),
					domSpan=document.createElement("span"),
					domA=document.createElement("a");
				domA.href=most[i].url;
				domSpan.innerText=most[i].title;
				domImg.src=(browserType=="cr"?"chrome://favicon/":"https://www.google.com/s2/favicons?domain=")+most[i].url;
				domA.appendChild(domImg);
				domA.appendChild(domSpan);
				domLi.appendChild(domA);
				dombox.appendChild(domLi);
			}
		})
	}
}
st.init();