// this code is to send both message and gps location together to lora and to open air



#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <TinyGPS++.h>
#include <SoftwareSerial.h>

#define RXPin 16  // connect RX of the gps to 16 and connect TX pin of gps to pin 17
#define TXPin 17
#define GPSBaud 9600

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

const char* ap_ssid = "LoRa_ESP32_transmitter";
const char* ap_password = "11111111";

AsyncWebServer server(80);

void setup() {
  Serial.begin(9600); 
  ss.begin(GPSBaud);

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
          document.getElementById("message").value = ''; 
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

  // Serve HTML page
  server.on("/", HTTP_GET, [html](AsyncWebServerRequest *request){
    request->send(200, "text/html", html);
  });

  server.on("/send", HTTP_GET, [](AsyncWebServerRequest *request){
    String message;
    if (request->hasParam("message")) {
      message = request->getParam("message")->value();
      //Serial.println("Sending message: " + message); 

      String gpsData = "";
      if (gps.location.isValid()) {
        gpsData = "Lat: " + String(gps.location.lat(), 6) + ", Lon: " + String(gps.location.lng(), 6);
      } else {
        gpsData = "longitude:      ,latitude:   ";
      }

      String combinedMessage = "Message: " + message + "\n" + gpsData;

      Serial.println("Sending message: " + combinedMessage); 



      request->send(200, "text/plain", "Message sent: " + combinedMessage);
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
  while (ss.available() > 0) {
    gps.encode(ss.read());
  }
}
