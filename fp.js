
document.onmouseup = function(e){
	cx = e.clientX 
	cy = e.clientY
	selection = window.getSelection();
	data = selection.anchorNode.data
	if(data == undefined)
		return;
	popup.invoke(cx+50, cy+50);
	popup.getSel(data);
}

var popup = {
	data: "",
	invoke: function(x,y){

		var fp = document.createElement('img');
		fp.id = 'notes_float_panel';
		fp.src = chrome.extension.getURL("edit.png");
		fp.style = 'position:absolute;'+
				   'left:' +x+
				   'rigth:'+y;
		fp.addEventListener("click", popup.sendData)
		document.body.appendChild(fp);
	},

	getSel: function(data){
		this.data = data;
	},

	sendData: function(){
		var data = 'note[content]='+encodeURIComponent(popup.data)
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:3000/notes", true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = JSON.parse(xhr.responseText);
			}
		}
		xhr.send(data);
	}
}