const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

let allChat = [];

const INTERVAL = 3000;

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };

  await fetch('/poll', options);
}

async function getNewMsgs() {
  try {
    const res = await fetch('/poll');

    if (res.status >= 400) {
      throw new error('request didn\'t succeed ' + res.status);
    }

    const json = await res.json();

    allChat = json.msg;
    render();

    failedTries = 0;
  } catch (error) {
    console.error('Polling error', error);
    failedTries++;
  }
  // with timeout
  // setTimeout(getNewMsgs, INTERVAL);
  // allChat = json.msg;
  // render();
}

function render() {
  // as long as allChat is holding all current messages, this will render them
  // into the ui. yes, it's inefficent. yes, it's fine for this example
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) => `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// with timeout
// getNewMsgs();

const BACKOFF = 5000;
let timeToMakeNextRequest = 0;
let failedTries = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL + failedTries * BACKOFF;
  }

  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);