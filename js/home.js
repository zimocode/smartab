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
		this.setBingImage();
		this.setList();
	},
	XHR:async function(url,method){
		method=method||"GET";
		return new Promise(function(resolve,reject){
			let xhr=new XMLHttpRequest();
			xhr.open(method,url);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					resolve(xhr.responseXML);
				}
			}
			xhr.send();
		});
	},
	setBingImage:function(){
		st.XHR("https://bing.com/HPImageArchive.aspx?idx=0&n=1").then(function(responseXML){
			let data={
				imageURL:"https://www.bing.com"+responseXML.querySelector("images>image>url").innerHTML,
				copyrightString:responseXML.querySelector("images>image>copyright").innerHTML,
				copyrightURL:responseXML.querySelector("images>image>copyrightlink").innerHTML
			}
			let dom=document.querySelector("homeimage"),
				domCopyright=document.querySelector("#copyright");
			dom.style.cssText+="background-image:url("+data.imageURL+");";
			domCopyright.href=data.copyrightURL;
			domCopyright.innerText=data.copyrightString;
			dom.style.cssText+="opacity:1;";
		});
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