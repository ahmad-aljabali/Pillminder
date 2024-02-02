 #define encoderOutA 5 // CLK pin of Rotary Enocoder
 #define encoderOutB 4 // DT pin of Rotary Enocoder
 
 int counter = 0; 
 int presentState;
 int previousState;  
 void setup() { 
   pinMode (encoderOutA,INPUT);
   pinMode (encoderOutB,INPUT);
   
   Serial.begin (115200);
      previousState = digitalRead(encoderOutA);   // Get current state of the encoderOutA
 } 
 void loop() { 
   presentState = digitalRead(encoderOutA); 
      if (presentState != previousState)
      {     
          if (digitalRead(encoderOutB) != presentState) 
          { 
       counter ++;
     } 
     else {
       counter --;
     }
     Serial.print("Position: ");
     Serial.println(counter);
   } 
   previousState = presentState; // Replace previous state of the encoderOutA with the current state
 }
