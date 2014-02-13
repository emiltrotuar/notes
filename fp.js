document.onmouseup = function(e){
  var fp = document.getElementById('notes_float_panel');
  var selection = window.getSelection().toString();
  if( check(selection,fp) ){
    var cx = e.clientX;
    var cy = e.clientY;
    popup.invoke(cx+50, cy+50);
    popup.getSel(selection);
  } 
}

function check(selection,fp){
  if(selection.length && fp){
    fp.removeEventListener("mousedown", popup.sendData);
    document.body.removeChild(fp);
    popup.exists = false;
    return;
  }
  else if(selection.length && !fp && popup.exists){
    popup.exists = false
    return;
  }
  else if(!selection.length && fp){
    fp.removeEventListener("mousedown", popup.sendData);
    document.body.removeChild(fp);
    popup.exists = false;
    return;
  }
  else if(!selection.length && !fp){
    return;
  }
  else 
    return true;
}

var popup = {
  exists: false,
  data: "",

  invoke: function(x,y){
    var fp = document.createElement('img');
    fp.id = 'notes_float_panel';
    fp.src = chrome.extension.getURL("edit.png");
    fp.style = 'position:absolute;'+
               'left:' +x+
               'rigth:'+y;
    fp.addEventListener("mousedown", popup.sendData);
    document.body.appendChild(fp);
    popup.exists = true;
  },

  getSel: function(data){
    this.data = data;
  },

  sendData: function(ev){
    ev.stopPropagation();
    var fp = document.getElementById('notes_float_panel');
    fp.removeEventListener("mousedown", popup.sendData);
    document.body.removeChild(fp);

    var data = JSON.stringify({note: {content: popup.data}})
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/notes.json", true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        var options = {
          type:    "basic",
          title:   resp.created_at,
          message: resp.content,
          iconUrl: chrome.extension.getURL("edit.png")
        }
        chrome.notifications.create("", options, function(noteId){});
      }
    }
    xhr.send(data);
  }   
}