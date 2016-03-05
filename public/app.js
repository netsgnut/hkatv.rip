(function () {
  var isMobile = (window.matchMedia('(max-device-width: 800px)').matches);

  // Queue messages
  var pendingMessages = [];

  var dataRef = new Firebase('https://atv-rip.firebaseio.com/messages');
  var lastMessageQuery = dataRef.limitToLast(isMobile ? 25 : 100);
  lastMessageQuery.on('child_added', function(snapshot) {
    var message = snapshot.val();
    pendingMessages.push(message.text);
  });

  // Display message as marquee
  var marqueeHolder = $('#messages')[0];

  function displayChatMessage(text) {
    var marqueeDiv = document.createElement('div');
    marqueeDiv.className = 'marquee';
    marqueeDiv.style.top = Math.floor(Math.random() * 90) + '%';
    marqueeDiv.style.fontSize = Math.floor(Math.random() * 4 + 3) + 'vmin';
    if (!isMobile) {
      marqueeDiv.style.animationDelay = Math.floor(Math.random() * 8) + 's';
      marqueeDiv.style.animationDuration = 15 + Math.floor(Math.random() * 4) * 3 + 's';
    }
    marqueeDiv.textContent = text;
    marqueeHolder.appendChild(marqueeDiv);
  }

  setInterval(function () {
    var message = pendingMessages.shift();
    if (message) {
      displayChatMessage(message);
    }
  }, 1000);

  // Form
  var $nameEl = $('#name');
  var $messageEl = $('#message');

  $nameEl.val(localStorage.getItem('name'));
  $nameEl.on('input propertychange paste', function (e) {
    localStorage.setItem('name', $nameEl.val());
  });

  $messageEl.on('keydown', function (e) {
    if (e.keyCode == 13) {
      var name = $nameEl.val();
      var text = $messageEl.val();
      if (name.length > 0 && text.length > 0) {
        dataRef.push({ name: name, text: text });
        $messageEl.val('');
      }
    }
  });
})();

