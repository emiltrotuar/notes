
document.onmouseup = function(e){
	cx = e.clientX 
	cy = e.clientY
	selection = window.getSelection();
	popup.invoke(cx+50, cy+50);
	popup.getSel(selection);
}

var popup = {
	sel: "",
	invoke: function(x,y){

		var fp = document.createElement('img');
		fp.id = 'notes_float_panel';
		fp.src = chrome.extension.getURL("edit.png");
		fp.style = 'position:absolute;'+
				   'left:' +x+
				   'rigth:'+y
		document.body.appendChild(fp);
	},

	getSel: function(s){
		this.sel = s
	},

	sendData: function(){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://mytods.com/notes", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = JSON.parse(xhr.responseText);
			}
		}
		xhr.send();
	}
}