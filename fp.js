
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
		body.insertAdjacentHTML('<img id="notes_float_panel" src="edit.png">', x, y)
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