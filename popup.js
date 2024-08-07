document
  .getElementById('addEventButton')
  .addEventListener('click', function () {
    const eventText = document.getElementById('eventText').value;
    const eventDetails = parseEventText(eventText);
    if (eventDetails) {
      authenticate()
        .then((token) => {
          addEventToGoogleCalendar(token, eventDetails);
        })
        .catch((error) => {
          document.getElementById('status').innerText = 'Authentication error.';
        });
    } else {
      document.getElementById('status').innerText = 'Invalid format.';
    }
  });

function parseEventText(text) {
  const match = text.match(
    /(\d{2})(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})(\d{2}) '(.*)'/
  );
  if (!match) return null;

  const [, month, day, startHour, startMinute, endHour, endMinute, title] =
    match;
  const year = new Date().getFullYear();
  return {
    start: new Date(year, month - 1, day, startHour, startMinute),
    end: new Date(year, month - 1, day, endHour, endMinute),
    title,
  };
}

function authenticate() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: 'authenticate' }, function (response) {
      if (response.token) {
        resolve(response.token);
      } else {
        reject(response.error);
      }
    });
  });
}

function addEventToGoogleCalendar(token, event) {
  fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: event.title,
      start: { dateTime: event.start.toISOString() },
      end: { dateTime: event.end.toISOString() },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('status').innerText = 'Event added!';
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('status').innerText = 'Error adding event.';
    });
}
