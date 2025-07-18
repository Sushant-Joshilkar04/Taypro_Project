#define GSM Serial2  // Define Serial2 for communication with the EC200U GSM module

String apiKey = "OHESV0ZX1UEAVVB8";    // Replace with your ThingSpeak API Key
String latitude = "", longitude = "";  // Variables to store GPS data

void setup() {
  Serial.begin(115200);  // Initialize Serial Monitor for debugging
  GSM.begin(115200);     // Initialize communication with the EC200U module at 115200 baud rate

  // Initialize EC200U GSM Module
  if (!sendCommand("AT", "OK", 1000)) return;                                            // Test communication with the module
  if (!sendCommand("AT+CGATT=1", "OK", 2000)) return;                                    // Attach to the network
  if (!sendCommand("AT+QICSGP=1,1,\"airtelgprs.com\",\"\",\"\",1", "OK", 2000)) return;  // Configure PDP context for Airtel network
  if (!sendCommand("AT+QIACT=1", "OK", 3000)) return;                                    // Activate the PDP context

  // Enable GPS
  if (!enableGPS()) {
    Serial.println("GPS initialization failed. Check antenna and module setup.");
  }

  // Open a TCP connection to ThingSpeak
  if (!sendCommand("AT+QIOPEN=1,0,\"TCP\",\"api.thingspeak.com\",80,0,1", "CONNECT", 5000)) {
    Serial.println("Failed to open TCP connection.");
  }
}

void loop() {
  // Retrieve GPS data
  if (getGPSData()) {
    // If GPS data is retrieved successfully, send it to ThingSpeak
    sendDataToThingSpeak(apiKey, latitude, longitude);
  } else {
    Serial.println("Failed to retrieve GPS data.");
  }

  delay(10000);  // Wait 10 seconds before the next loop (adjust as needed)
}

/**
 * Function to enable GPS on the EC200U module
 * Retries up to 3 times in case of failure
 * Returns true if GPS is enabled successfully, otherwise false
 */
bool enableGPS() {
  for (int i = 0; i < 3; i++) {  // Retry up to 3 times
    if (sendCommand("AT+QGPS=1", "OK", 2000)) {
      Serial.println("GPS enabled successfully.");
      return true;
    }
    delay(2000);  // Wait 2 seconds before retrying
  }
  return false;
}

/**
 * Function to retrieve GPS data from the EC200U module
 * Parses the response to extract latitude and longitude
 * Returns true if data is retrieved successfully, otherwise false
 */
bool getGPSData() {
  String response = sendCommand("AT+QGPSLOC=2", "OK", 10000);  // Request GPS location in readable format
  if (response.indexOf("+QGPSLOC:") != -1) {
    latitude = parseLatitude(response);    // Extract latitude from response
    longitude = parseLongitude(response);  // Extract longitude from response
    Serial.println("GPS Data: Latitude = " + latitude + ", Longitude = " + longitude);
    return true;
  }
  return false;
}

/**
 * Function to send GPS data to ThingSpeak using an HTTP GET request
 * Opens a TCP session if not already active and sends the data
 */
void sendDataToThingSpeak(String apiKey, String latitude, String longitude) {
  // Construct the HTTP GET request
  String httpRequest = "GET /update?api_key=" + apiKey + "&field1=" + latitude + "&field2=" + longitude + " HTTP/1.1\r\n" + "Host: api.thingspeak.com\r\n" + "Connection: close\r\n\r\n";

  int length = httpRequest.length();  // Calculate the length of the HTTP request

  // Check if the TCP session is active
  String tcpState = sendCommand("AT+QISTATE=1,0", "OK", 2000);  // Check the state of the TCP session
  if (tcpState.indexOf("STATE: CONNECT") == -1) {
    Serial.println("TCP session not active. Reopening...");
    sendCommand("AT+QICLOSE=0", "OK", 1000);                                              // Close the previous session if needed
    sendCommand("AT+QIOPEN=1,0,\"TCP\",\"api.thingspeak.com\",80,0,1", "CONNECT", 5000);  // Open a new session
  }

  // Send the HTTP GET request
  if (sendCommand("AT+QISEND=0," + String(length), ">", 2000)) {
    GSM.print(httpRequest);  // Send the HTTP request string
    GSM.write(26);           // Send Ctrl+Z to indicate the end of the data
    Serial.println("Data sent to ThingSpeak.");
    handleResponse(5000);  // Optionally handle the response from the server
  } else {
    Serial.println("Failed to send data.");
  }
}

/**
 * Helper function to send an AT command to the EC200U module
 * Waits for a specific expected response within a given timeout
 * Returns the full response as a String
 */
String sendCommand(String command, String expected, unsigned long timeout) {
  GSM.println(command);  // Send the AT command
  unsigned long startTime = millis();
  String response = "";

  while (millis() - startTime < timeout) {
    while (GSM.available()) {
      char c = GSM.read();  // Read incoming data from the module
      response += c;

      if (response.indexOf(expected) != -1) {  // Check if the expected response is received
        Serial.println("Success: " + command);
        return response;
      }
    }
  }

  Serial.println("Timeout or Failed: " + command);
  Serial.println("Response: " + response);
  return "";  // Return empty string if the command fails
}

/**
 * Helper function to parse the latitude from GPS response
 * Returns the extracted latitude as a String
 */
String parseLatitude(String gpsData) {
  int startIndex = gpsData.indexOf(",") + 1;        // Find the first comma and move to the next character
  int endIndex = gpsData.indexOf(",", startIndex);  // Find the next comma
  return gpsData.substring(startIndex, endIndex);   // Extract and return the latitude value
}

/**
 * Helper function to parse the longitude from GPS response
 * Returns the extracted longitude as a String
 */
String parseLongitude(String gpsData) {
  int startIndex = gpsData.indexOf(",", gpsData.indexOf(",") + 1) + 1;  // Skip the first two commas
  int endIndex = gpsData.indexOf(",", startIndex);                      // Find the next comma
  return gpsData.substring(startIndex, endIndex);                       // Extract and return the longitude value
}

/**
 * Helper function to handle and print responses from the EC200U module
 * Waits for a response for the specified timeout period
 */
void handleResponse(unsigned long timeout) {
  String response = "";
  unsigned long startTime = millis();

  while (millis() - startTime < timeout) {
    while (GSM.available()) {
      char c = GSM.read();  // Read incoming data
      response += c;
    }
  }

  if (response.length() > 0) {  // Print the response if any
    Serial.println("Response:");
    Serial.println(response);
  }
}
