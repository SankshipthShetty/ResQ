
//this code opens the captive portal in 192.168.4.1 ip address where an server is hosted
//esp32
#include <WiFi.h>
#include <ESPAsyncWebServer.h>


const char* ap_ssid = "ESP32_AP_Transmitter";
const char* ap_password = "11111111";

AsyncWebServer server(80);

void setup() {
  Serial.begin(9600); 
  Serial.println("ESP32 is ready");

  
  WiFi.softAP(ap_ssid, ap_password);
  Serial.println("Access Point started");
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP Address: ");
  Serial.println(IP);

  
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
          document.getElementById("message").value = ''; // Clear the input field after sending
        }
      };
      xhr.send();
    }
  </script>
  </head>
  <body>
    <h1>Enter text to send via LoRa</h1>
    <form onsubmit="sendMessage(event)">
      <input type="text" id="message" name="message" required>
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
      Serial.println("Sending message: " + message); 

      

      request->send(200, "text/plain", "Message sent: " + message);
    } else {
      request->send(200, "text/plain", "No message sent");
    }
  });

  
  server.onNotFound([](AsyncWebServerRequest *request) {
    request->redirect("/");
  });

  
  server.begin();
}

void loop() {

}
