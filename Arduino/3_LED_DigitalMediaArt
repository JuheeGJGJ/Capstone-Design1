void setup()
{
  pinMode (21, OUTPUT);
  pinMode (22, OUTPUT);
  pinMode (23, OUTPUT);
  Serial.begin (115200);
}

int i = 0;

void loop () {  
  digitalWrite(21, 1);
  delay(300);
  digitalWrite(22, 1);
  delay(300);
  digitalWrite(23, 1);
  delay(500);
  
  digitalWrite(21, 0);
  digitalWrite(22, 0);
  digitalWrite(23, 0);
  delay(300);
  
  digitalWrite(21, 1);
  digitalWrite(22, 1);
  digitalWrite(23, 1);
  delay(300);  
  
  digitalWrite(21, 0);
  digitalWrite(22, 0);
  digitalWrite(23, 0);
  delay(300);
  
  digitalWrite(21, 1);
  digitalWrite(22, 1);
  digitalWrite(23, 1);
  delay(300);
  
  digitalWrite(23, 0);
  delay(300);
  digitalWrite(22, 0);
  delay(300);
  digitalWrite(21, 0);
  delay(300);

  Serial.printf ("i = %d\n", i++);
}
