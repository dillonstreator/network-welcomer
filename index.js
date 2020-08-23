const say = require("say");
const { exec } = require("child_process");

require("dotenv").config();

const { IP, PERSON, ALLOWED_CONSECUTIVE_TIMEOUTS = 2 } = process.env;
if (!IP || !PERSON) {
  console.error("`IP` && `PERSON` environment variables are required");
  process.exit(1);
}

const pinger = exec(`ping -t ${IP}`);

let isHere = false;
let numConsecutiveTimeouts = 0;
pinger.stdout.on("data", (d) => {
  const message = d.toString().trim();

  // misc output that we don't care about
  if (["Request","Reply"].every(m => !message.includes(m))) return;

  if (message.indexOf(IP) == -1) {
    numConsecutiveTimeouts++;
    if (numConsecutiveTimeouts > ALLOWED_CONSECUTIVE_TIMEOUTS) isHere = false;
    return;
  }
  numConsecutiveTimeouts = 0;
  if (isHere) return;
  isHere = true;

  say.speak(`Welcome to the network, ${PERSON}`);
});
