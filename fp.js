this.tlHost = undefined;
this.tlToken = undefined;
this.tlPayload = undefined;

chrome.storage.local.get(['token','host'], function(items) {
  tlToken = items.token || getToken();
  tlHost = items.host
});

function getToken(){
  getCredentials()
  signIn();
}

function storeToken(xhr){
  tlToken = xhr.getResponseHeader('X-TL-Token')
  if (tlToken) {
    chrome.storage.local.set({ token: tlToken })
  }
}

function getCredentials(){
  chrome.storage.local.get(['host','email','password'], function(items) {
    tlHost = items.host;
    email = items.email;
    password = items.password;

    tlOptions = !!(tlHost.length && email.length && password.length)
    if (!tlOptions){ alert('set options'); return}

    tlPayload = {
      user: {
        email: email,
        password: password
      }
    }
  });
}

function signIn(){
  var data = JSON.stringify(tlPayload)
  var xhr = new XMLHttpRequest();
  xhr.open("POST", tlHost+"/users/sign_in.json", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-TL-Client', 'extension');
  xhr.send(data);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      storeToken(xhr)
    }
  }
}

var link = document.createElement('link');
link.href =  chrome.extension.getURL('fp.css');
link.rel = 'stylesheet';
document.documentElement.insertBefore(link);

document.onmouseup = function(e){
  var fp = document.getElementById('notes_float_panel');
  var selection = window.getSelection().toString();
  if ( check(selection,fp) ){
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
  if (selection.length && fp){
    if (selection != popup.data){
      remove_panel(fp);
      return true;
    }
    remove_panel(fp);
    return;
  }
  else if (selection.length && !fp){
    return true;
  }
  else if (!selection.length && fp){
    remove_panel(fp);
    return;
  }
  else if (!selection.length && !fp){
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
    if (!tlToken) { alert('set options'); return }
    var fp = document.getElementById('notes_float_panel');
    remove_panel(fp);
    var data = JSON.stringify({note: {content: popup.data}})
    var xhr = new XMLHttpRequest();
    xhr.open("POST", tlHost+"/notes.json", true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('X-TL-Token', tlToken)
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        storeToken(xhr)
        var date = (new Date).toString()
        var options = {
          type:    "basic",
          title:   date,
          message: resp.note.content,
          iconUrl: chrome.extension.getURL("edit.png")
        }
        chrome.runtime.sendMessage(options);
      }
    }
    xhr.send(data);
  }
}