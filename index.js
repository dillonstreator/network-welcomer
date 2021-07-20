const say = require("say");
const { exec } = require("child_process");
const ips = require("./ips.json");

require('dotenv').config()

const {
  ALLOWED_CONSECUTIVE_MISSED_PINGS = 10,
  GREETING_QUEUE_PROCESSING_TIMEOUT_IN_MS = 100
} = process.env;

const greetingQueue = [];

const handlePinging = ({
  ip,
  greeting,
  allowedConsecutiveMissedPings = ALLOWED_CONSECUTIVE_MISSED_PINGS
}) => {
  const pinger = exec(`ping -t ${ip}`);

  let isHere = false;
  let numConsecutiveMissedPings = 0;
  pinger.stdout.on("data", (d) => {
    const message = d.toString().trim();
    console.log(`[${ip}] ${message}`)

    // misc output that we don't care about
    if (["Request","Reply"].every(m => !message.includes(m))) return;

    if (message.indexOf(ip) == -1) {
      numConsecutiveMissedPings++;
      if (numConsecutiveMissedPings > allowedConsecutiveMissedPings) {
        console.log(`[${ip}] has left the building`)
        isHere = false
      };
      return;
    }
    numConsecutiveMissedPings = 0;
    if (isHere) return;
    isHere = true;

    greetingQueue.push(greeting);
  });
}

ips.forEach(handlePinging);

(() => {
  let isGreeting = false;
  const processor = () => {
    setTimeout(processor, GREETING_QUEUE_PROCESSING_TIMEOUT_IN_MS);
    if (isGreeting || !greetingQueue.length) return;

    say.speak(greetingQueue.shift(), undefined, undefined, () => isGreeting = false)
  }
  processor();
})();
