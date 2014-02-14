var link = document.createElement('link');
link.href =  chrome.extension.getURL('fp.css');
link.rel = 'stylesheet';
document.documentElement.insertBefore(link);

document.onmouseup = function(e){
  var fp = document.getElementById('notes_float_panel');
  var selection = window.getSelection().toString();
  if( check(selection,fp) ){
    var cx = e.clientX;
    var cy = e.clientY;
    var st = document.body.scrollTop
    popup.invoke(cx-50, cy-30+st);
    popup.getSel(selection);
  } 
}

function remove_panel(fp){
  fp.removeEventListener("mousedown", popup.sendData);
  document.body.removeChild(fp);
}

function check(selection,fp){
  if(selection.length && fp){
    if(selection != popup.data){
      remove_panel(fp);
      return true;
    }
    remove_panel(fp);
    return;
  }
  else if(selection.length && !fp){
    return true;
  }
  else if(!selection.length && fp){
    remove_panel(fp);
    return;
  }
  else if(!selection.length && !fp){
    return;
  }
  else 
    return true;
}

var popup = {
  data: "",

  invoke: function(x,y){
    var fp = document.createElement('img');
    fp.id = 'notes_float_panel';
    fp.src = chrome.extension.getURL("edit.png");
    fp.style.cssText = 'position:absolute;\
                        left:'+x+'px;\
                        top:' +y+'px;'
    fp.addEventListener("mousedown", popup.sendData);
    document.body.appendChild(fp);
  },

  getSel: function(data){
    this.data = data;
  },

  sendData: function(ev){
    ev.stopPropagation();
    var fp = document.getElementById('notes_float_panel');
    remove_panel(fp);

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
        chrome.runtime.sendMessage(options);
      }
    }
    xhr.send(data);
  }   
}