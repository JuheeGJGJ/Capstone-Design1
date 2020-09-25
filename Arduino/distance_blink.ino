const int ledPin_R = 23;
const int ledPin_Y = 26;
const int ledPin_B = 21;
const int ledPin_Ground = 25;
const int trigPin = 2;
const int echoPin = 4;

void setup()
{
  pinMode (ledPin_R, OUTPUT);
  pinMode (ledPin_Y, OUTPUT);
  pinMode (ledPin_B, OUTPUT);
  pinMode (ledPin_Ground, OUTPUT);
  digitalWrite (ledPin_Ground, 0);
  pinMode (trigPin, OUTPUT);
  pinMode (echoPin,INPUT);
  Serial.begin (115200);
}

int i;

long get_delay_time () {
 long duration, distance, delay_time;
  digitalWrite (trigPin, HIGH); // trigPin에서 초음파 발생
  delayMicroseconds(10); 
  digitalWrite (trigPin, LOW);

  duration = pulseIn (echoPin, HIGH); // echoPin pulse 유지 시간 저장
  distance = 340 * duration / 1000 / 2; // distance 계산 (초음파는 340m/s, 왕복거리니까 2로 나누어줌)
  // 1000000 microsecond = 1s, 1000mm = 1m

  delay_time = distance * distance / 500;
  if (delay_time > 500) delay_time = 500;

  Serial.printf ("i = %d\n", i++);
  Serial.printf ("distance = %ld\n", distance);
  Serial.printf ("delay_time = %ld\n", delay_time);
  
  return delay_time;
}

void loop () {  
  long delay_time;
  
  delay_time = get_delay_time ();  
  digitalWrite (ledPin_R, 1);
  delay (delay_time);
  
  delay_time = get_delay_time ();
  digitalWrite (ledPin_Y, 1);
  delay (delay_time);
  
  delay_time = get_delay_time ();
  digitalWrite (ledPin_B, 1);
  delay (delay_time);
    
  delay_time = get_delay_time ();
  digitalWrite (ledPin_B, 0);
  delay (delay_time);  
  
  delay_time = get_delay_time ();
  digitalWrite (ledPin_Y, 0);
  delay (delay_time);
  
  delay_time = get_delay_time ();
  digitalWrite (ledPin_R, 0);
  delay (delay_time);

}
