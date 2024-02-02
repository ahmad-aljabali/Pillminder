#include <Servo.h>
Servo myServo;
int servoPin = 9;

void setup(){
  myServo.attach(servoPin);
  Serial.print(myServo.read());
}

void loop(){
  myServo.write(0);
  Serial.print(myServo.read());
  delay(1000);
  myServo.write(90);
  Serial.print(myServo.read());
  delay(1000);
  myServo.write(180);
  delay(1000);
}
