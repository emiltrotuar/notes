function save_options() {
  var host = document.getElementById('host').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  chrome.storage.local.set({
    host: host,
    email: email,
    password: password
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.local.get('host', function(items) {
    document.getElementById('host').value = items.host;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);