// wifiMulti.addAP("SSID", "PASSWORD");의 SSID PASSWORD는 나의 WiFi의 SSID, PASSWORD로 바꾸어 줄 것!

#include <OneWire.h>
#include <DallasTemperature.h>

#include <WiFi.h>
#include <WiFiMulti.h>

#include <HTTPClient.h>
WiFiMulti wifiMulti;

String url = "http://ec2-3-80-148-124.compute-1.amazonaws.com:8000/week4/update?";

// GPIO where the DS18B20 is connected to
const int oneWireBus = 23;     
const int trigPin = 2;
const int echoPin = 4;

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

void setup() {
  pinMode (trigPin, OUTPUT);
  pinMode (echoPin,INPUT);
  
  // Start the Serial Monitor
  Serial.begin(115200);
  // Start the DS18B20 sensor
  sensors.begin();

  wifiMulti.addAP("SSID", "PASSWORD");
}

void httpGet(long distance, float temp) {
  String new_url = url + "temp=" + temp + "&activity=" + distance;
  Serial.println(new_url);
  if((wifiMulti.run() == WL_CONNECTED)) {
    HTTPClient http;
    Serial.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(new_url); //HTTP
  
    Serial.print("[HTTP] GET...\n");
    // start connection and send HTTP header
    int httpCode = http.GET();
    
    // httpCode will be negative on error
    if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] GET... code: %d\n", httpCode);
      
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println(payload);
      }
    } else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
  }
    else Serial.println("NO WIFI");
}

void loop() { 
  long duration, distance;
  digitalWrite (trigPin, HIGH); // trigPin에서 초음파 발생
  delayMicroseconds(10); 
  digitalWrite (trigPin, LOW);

  duration = pulseIn (echoPin, HIGH); // echoPin pulse 유지 시간 저장
  distance = 340 * duration / 1000 / 2; // distance 계산 (초음파는 340m/s, 왕복거리니까 2로 나누어줌), 1000000 microsecond = 1s, 1000mm = 1m
  
  sensors.requestTemperatures(); 
  float temperatureC = sensors.getTempCByIndex(0);

  httpGet (distance, temperatureC);
  delay(5000);
}
