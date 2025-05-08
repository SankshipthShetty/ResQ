#include <WiFi.h>
#include <ESPAsyncWebServer.h>


const char* ssid = "srujan";
const char* password = "11111111";

AsyncWebServer server(80);

void setup() {
  Serial.begin(9600); 
  Serial.println("ESP32 is ready");

  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  
  Serial.println(WiFi.localIP());

  
  const char* html = R"rawliteral(
  <!DOCTYPE HTML><html>
  <head><title>LoRa Sender</title></head>
  <script>
    function sendMessage(event) {
      event.preventDefault();
      var xhr = new XMLHttpRequest();
      var url = "/send?message=" + encodeURIComponent(document.getElementById("message").value);
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          alert(xhr.responseText);
          window.location.reload();
        }
      };
      xhr.send();
    }
  </script>
  </head>
  <body>
    <h1>Enter text to send via LoRa</h1>
    <form onsubmit="sendMessage(event)">
      <input type="text" id="message" name="message">
      <input type="submit" value="Send">
    </form>
  </body>
  </html>)rawliteral";

  
  server.on("/", HTTP_GET, [html](AsyncWebServerRequest *request){
    request->send(200, "text/html", html);
  });

  
  server.on("/send", HTTP_GET, [](AsyncWebServerRequest *request){
    String message;
    if (request->hasParam("message")) {
      message = request->getParam("message")->value();
      Serial.println(message);
      request->send(200, "text/plain", "Message sent: " + message);
    } else {
      request->send(200, "text/plain", "No message sent");
    }
  });

  
  server.begin();
}

void loop() {
  
}
