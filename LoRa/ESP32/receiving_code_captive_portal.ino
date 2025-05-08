#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <deque>

#define MAX_MESSAGES 5

AsyncWebServer server(80);
std::deque<String> messages;

const char* ssid = "ESP32_AP_receiver";
const char* password = "11111111";

const char* html = R"rawliteral(
<!DOCTYPE HTML><html>
<head><title>LoRa Receiver</title></head>
<body>
  <h1>ResQ-LoRa</h1>
  <h1>Received Messages</h1>
  <div id="messages"></div>
  <script>
    function fetchMessages() {
      fetch('/messages')
        .then(response => response.text())
        .then(data => {
          document.getElementById('messages').innerHTML = data.replace(/\n/g, '<br>');
        });
    }
    setInterval(fetchMessages, 1000); // Fetch messages every second
  </script>
</body>
</html>)rawliteral";

void setup() {
  Serial.begin(9600); 

  WiFi.softAP(ssid, password);

  Serial.println("Access Point Started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/html", html);
  });

  server.on("/messages", HTTP_GET, [](AsyncWebServerRequest *request){
    String messageList;
    for (const String& message : messages) {
      messageList += " " + message + "\n";
    }
    request->send(200, "text/plain", messageList);
  });

  server.begin();

  WiFi.onEvent([](WiFiEvent_t event, WiFiEventInfo_t info) {
    if (event == ARDUINO_EVENT_WIFI_AP_STAIPASSIGNED) {
      Serial.println("Client connected, redirecting to captive portal...");
      delay(1000); 
      WiFi.softAPIP(); 
    }
  }, ARDUINO_EVENT_WIFI_AP_STAIPASSIGNED);
}

void loop() {
  if (Serial.available()) {
    String receivedMessage = Serial.readStringUntil('\n');
    receivedMessage.trim(); 

    if (receivedMessage.length() > 0) { 
      Serial.print(" ");
      Serial.println(receivedMessage);

      if (messages.size() >= MAX_MESSAGES) {
        messages.pop_front(); 
      }
      messages.push_back(receivedMessage);
    }
  }
}
