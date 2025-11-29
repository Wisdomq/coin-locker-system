/**
 * Device client: publishes unlock commands to MQTT broker.
 * Expects environment variables:
 * - MQTT_BROKER_URL (e.g., mqtt://mosquitto:1883)
 * - MQTT_USERNAME, MQTT_PASSWORD (optional)
 *
 * Topic convention: locker/<locker-code>/cmd
 */

const mqtt = require('mqtt');

const broker = process.env.MQTT_BROKER_URL || 'mqtt://mosquitto:1883';
const options = {};
if (process.env.MQTT_USERNAME) options.username = process.env.MQTT_USERNAME;
if (process.env.MQTT_PASSWORD) options.password = process.env.MQTT_PASSWORD;

let client;
function connect() {
  if (client && client.connected) return client;
  client = mqtt.connect(broker, options);
  client.on('connect', () => console.log('MQTT connected to', broker));
  client.on('error', e => console.error('MQTT error', e));
  return client;
}

async function publishUnlock(lockerCode, payload = {}) {
  const c = connect();
  const topic = `locker/${lockerCode}/cmd`;
  const message = JSON.stringify({ cmd: 'unlock', token: generateShortToken(), payload });
  c.publish(topic, message, { qos: 1 }, (err) => {
    if (err) console.error('Publish error', err);
    else console.log('Published unlock to', topic);
  });
  return true;
}

function generateShortToken() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

module.exports = { publishUnlock };
