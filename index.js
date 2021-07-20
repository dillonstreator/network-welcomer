const say = require("say");
const { exec } = require("child_process");
const ips = require("./ips.json");

const handlePinging = ({
  ip,
  name,
  greeting = "Welcome to the network, {{NAME}}",
  allowedConsecutiveTimeouts = 2
}) => {
  const pinger = exec(`ping -t ${ip}`);

  let isHere = false;
  let numConsecutiveTimeouts = 0;
  pinger.stdout.on("data", (d) => {
    const message = d.toString().trim();
    console.log(`${ip} ${message}`)

    // misc output that we don't care about
    if (["Request","Reply"].every(m => !message.includes(m))) return;

    if (message.indexOf(ip) == -1) {
      numConsecutiveTimeouts++;
      if (numConsecutiveTimeouts > allowedConsecutiveTimeouts) isHere = false;
      return;
    }
    numConsecutiveTimeouts = 0;
    if (isHere) return;
    isHere = true;

    speakQueue.push(greeting.replace("{{NAME}}", name));
  });
}

ips.forEach(handlePinging);

