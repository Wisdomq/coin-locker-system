#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASS";

WebServer server(80);
const int RELAY_PIN = 26;

void handleUnlock() {
  digitalWrite(RELAY_PIN, HIGH);
  delay(5000);
  digitalWrite(RELAY_PIN, LOW);
  server.send(200, "text/plain", "Unlocked");
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  server.on("/unlock", handleUnlock);
  server.begin();
}

void loop() {
  server.handleClient();
}
