#include <SoftwareSerial.h>

#define MD0_PIN 7
#define MD1_PIN 6

SoftwareSerial lora(2, 3); // RX---3
//TX--3

void setup() {
  pinMode(MD0_PIN, OUTPUT);
  pinMode(MD1_PIN, OUTPUT);
  pinMode(9,OUTPUT)

  digitalWrite(MD0_PIN, LOW);
  digitalWrite(MD1_PIN, LOW);
  

  Serial.begin(9600);
  lora.begin(9600);
}

void loop() {
   if (Serial.available()) {
    String receivedMessage = Serial.readStringUntil('\n');
    receivedMessage.trim();

    if (receivedMessage.length() > 0) {
      Serial.print("Received message: ");
      Serial.println(receivedMessage);

      if (messages.size() >= MAX_MESSAGES) {
        messages.pop_front();
      }
      messages.push_back(receivedMessage);

      digitalWrite(9, HIGH);
      delay(200); 
      digitalWrite(9, LOW);
    }
}
