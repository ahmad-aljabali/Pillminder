#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <Servo.h>
#include <SoftwareSerial.h>

Adafruit_ST7735 tft = Adafruit_ST7735(10, 9, 8); // (CS, DC, RST)
Servo myservo;

#define encoderOutA 6 // CLK pin of Rotary Encoder
#define encoderOutB 7 // DT pin of Rotary Encoder
#define buttonPin 5    // Push-button pin
#define servoPin 4    // Servo control pin

SoftwareSerial ESP8266(3, 2);
const int arraySlot[7] = {80,93, 108, 123, 138, 153,180};
String names[7];
unsigned char times_check=0;
unsigned char check_connection=0;  
int counter ;// shife
int presentState;
int previousState;
int lastButtonState = HIGH;
int buttonState;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
bool medicineTaken = false;
bool medicinePutted = false;
int i;
String secondValueName="";
String espData = "";
int slotValue=-1;
int typeValue;
void setup() {
  Serial.print(arraySlot[1]);
  pinMode(encoderOutA, INPUT);
  pinMode(encoderOutB, INPUT);
  pinMode(buttonPin, INPUT_PULLUP); // Enable internal pull-up resistor for the button pin

  myservo.attach(servoPin);

  tft.initR(INITR_GREENTAB);
  tft.setRotation(1);

  Serial.begin(115200);
  ESP8266.begin(115200);
  Serial.println("rjeu");
ESP8266.print("***VER:");
delay(2000);
ESP8266.println("AT+RST");
delay(3000);
ESP8266.println("AT+CWQAP");
delay(1000);
ESP8266.println("AT+GMR");
delay(1000);
ESP8266.println("AT+CWMODE=3");
delay(1000);
ESP8266.println("AT+CWLAP");
delay(3000);
ESP8266.println("AT+CIPMUX=1"); // Set multiple connections mode
delay(1000);
ESP8266.println("AT+CIPSERVER=1,80");
delay(10000);
Serial.println("Connecting to Wifi");
ESP8266.print("AT+CWJAP=\"Klevis\",\"klevis2023\"\r\n");
delay(10000);
     

 // setupESP8266();

  previousState = digitalRead(encoderOutA);
  //Serial.print(previousState);// just to see what print in beging 
}

void loop() {
  handleEsp8266();
  moveEncoder();
  checkButton();
  
}

void connectToWifi() {
  Serial.println("Connecting to Wifi");
while(check_connection==0)
  {
    Serial.print(".");
    ESP8266.print("AT+CWJAP=\"Klevis\",\"klevis2023\"\r\n");
    ESP8266.setTimeout(5000);
     if(ESP8266.find("WIFI CONNECTED\r\n")==1)
      {
      Serial.println("WIFI CONNECTED");
      int variabbb=1;
      break;}
      times_check++;
     if(times_check>3) {
      times_check=0;
      Serial.println("Trying to Reconnect..");}
}}





void setupESP8266() {
  ESP8266.println("AT+CIPMUX=1"); // Set multiple connections mode
  delay(1000);
  ESP8266.println("AT+CIPSERVER=1,80");
  delay(1000);
}

void handleEsp8266() {
  while (ESP8266.available()) {
    char c = ESP8266.read();
    espData += c;
    //Serial.print(espData);
    if (c == '\n') {
      String result = extractSubstring(espData, ":GET /", "2520");
      if (result.length() > 0) {
        String firstValueType = extractSubstring(result, "?type=", "$");
        secondValueName = extractSubstring(result, "$name=", "&");
        String thirdValueSlot = extractSubstring(result, "&slot=", "%");

        Serial.println("Received Values:");
        Serial.println("Type: " + firstValueType);
        Serial.println("Name: " + secondValueName);
        Serial.println("Slot: " + thirdValueSlot);
        slotValue = thirdValueSlot.toInt();
        typeValue=firstValueType.toInt();
        names[slotValue]=secondValueName;

        espData = "";
        firstValueType = "";
        secondValueName = "";
        thirdValueSlot = "";
        result = "";
        //slotValue=-1;
      }
    } 
    /*
    else {
      espData += c;
    }*/
  }
}

void moveServoBasedOnSlot(int slotValue) {
  // Implement your servo movement logic based on the slot value
  int angle = map(slotValue, 0, 100, 0, 180); // Adjust the mapping as needed
  myservo.write(angle);
  delay(500); // Adjust delay as needed
}

void printToLCD(String message) {
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 20);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print("Name: ");
  tft.print(message);
}

String extractSubstring(const String &input, const String &startKeyword, const String &endKeyword) {
  int startIndex = input.indexOf(startKeyword);
  int endIndex = input.indexOf(endKeyword, startIndex + startKeyword.length());

  if (startIndex != -1 && endIndex != -1) {
    return input.substring(startIndex + startKeyword.length(), endIndex);
  } else {
    return ""; // Return an empty string if either start or end keyword is not found
  }
}

void checkButton() {
  int reading = digitalRead(buttonPin);

  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      if (buttonState == LOW  && slotValue==-1) {
        tft.fillScreen(0);
        tft.setCursor(50,60);
        tft.print("WAIT");
        servo_Slot(counter);
        tft.fillScreen(0); 
        tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 40);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print("medicine");
  tft.setCursor(10, 20);
  tft.print("Take the");
  tft.setCursor(10, 60);
  tft.print(names[counter]);
  Serial.print(names[counter]);
  Serial.print("the slot");
  Serial.print(counter);
  delay(3000);
  tft.fillScreen(0); 
  tft.setCursor(23, 60);
   tft.print("PILLMINDER");
      }
      if(buttonState==LOW && slotValue!=-1){
        if(typeValue==1){
          tft.fillScreen(0);
          tft.setCursor(30,60);
          tft.print("WAIT");
          servo_Slot(slotValue);
          
          tft.fillScreen(0); 
  //displayMessage("Take the");
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 40);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print("medicine");
  tft.setCursor(10, 20);
  tft.print("Take the");
  tft.setCursor(10, 60);
  tft.print(names[slotValue]);
  Serial.print(names[slotValue]);
  Serial.print("the slot");
  Serial.print(slotValue);
  delay(3000);
  tft.fillScreen(0); 
  tft.setCursor(10, 40);
   tft.print("PILLMINDER");
   slotValue=-1;
       }
       else {
        tft.fillScreen(0);
        tft.fillScreen(ST77XX_BLACK);
        tft.setTextSize(2);
       tft.setCursor(30,60);
          tft.print("WAIT");
          servo_Slot(slotValue);
          
          tft.fillScreen(0); 
  //displayMessage("Take the");
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 40);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print("medicine");
  tft.setCursor(10, 20);
  tft.print("Put the");
  tft.setCursor(10, 60);
  tft.print(names[slotValue]);
  
  Serial.print(names[slotValue]);
  Serial.print("the slot");
  Serial.print(slotValue);
  delay(3000);
  tft.fillScreen(0); 
  tft.setCursor(10, 40);
   tft.print("PILLMINDER");
   slotValue=-1;
       }
       
      }
    }
  }

  lastButtonState = reading;
}

void moveEncoder() { //in here just you take the nb of slot
  presentState = digitalRead(encoderOutA);
  if (presentState != previousState) {
    if (digitalRead(encoderOutB) != presentState) {
      counter++;
      if (counter > 6) {
        counter = 1;
      }
    } else {
      counter--;
      if (counter < 1) {
        counter = 6;
      }
    }
    Serial.print("Position: ");
    Serial.println(counter);

    tft.fillScreen(ST77XX_BLACK);
    tft.setCursor(10, 20);
    tft.setTextSize(2);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("Slot:");
    tft.print(counter);
  }
  previousState = presentState;
}

void moveServoBasedOnCounter(int counterValue) {
  int angle = calculateServoAngle(counterValue);
  myservo.write(angle);
  delay(500); // Delay to allow the servo to reach the desired position
}
int calculateServoAngle(int counterValue) {// change this with our angel
  //int maxAngle = 180;
  //int steps = 6; // Assuming 5 steps
  int targetAngle = 15* counterValue + 93;
  return targetAngle;
}

void displayMessage(String message) {
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 20);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print(message);
}

void servo_Slot(int angel){// is the slot 
  int ReadAngel=myservo.read();
  if (arraySlot[angel-1]<ReadAngel){
  //displayMessage("Wait"); 

    for ( i=ReadAngel; i>arraySlot[angel]; i -= 1) {
    myservo.write(i);  // Move the servo to the current angle
    Serial.println(i);
    delay(50);
  } //tft.fillScreen(0);
  //displayMessage("Take the medicine"+ secondValueName);
  }
  else {
    //displayMessage("Wait"); 
  for ( i=ReadAngel; i<arraySlot[angel]; i += 1) {
    myservo.write(i);  // Move the servo to the current angle
    Serial.println(i);
    delay(50);
  }
  /* 
  tft.fillScreen(0); 
  //displayMessage("Take the");
  tft.fillScreen(ST77XX_BLACK);
  tft.setCursor(10, 40);
  tft.setTextSize(2);
  tft.setTextColor(ST77XX_WHITE);
  tft.print("medicine");
  tft.setCursor(10, 20);
  tft.print("take the");
  tft.setCursor(10, 60);
  tft.print(names[angel]);
  Serial.print(names[angel]);
  Serial.print("the angel");
  Serial.print(angel); */
}
}


