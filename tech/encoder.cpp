#include <Encoder.h>

// Encoder Pins
#define ENCODER_A1 2  // Motor 1 Encoder A
#define ENCODER_B1 3  // Motor 1 Encoder B
#define ENCODER_A2 4  // Motor 2 Encoder A
#define ENCODER_B2 5  // Motor 2 Encoder B

// Motor Driver Pins
#define MOTOR1_PWM 9  // Motor 1 PWM pin
#define MOTOR1_DIR 8  // Motor 1 Direction pin
#define MOTOR2_PWM 10 // Motor 2 PWM pin
#define MOTOR2_DIR 7  // Motor 2 Direction pin

// Create Encoder Instances
Encoder encoder1(ENCODER_A1, ENCODER_B1);
Encoder encoder2(ENCODER_A2, ENCODER_B2);

// Control Parameters
const float targetSpeed = 15.0; // cm/sec
const float wheelCircumference = 4.5; // cm (Adjust as per your wheel size)
const int encoderPPR = 1024; // Pulses per revolution (Adjustable for AMT102)
const float gearRatio = 1.0; // If applicable
const float maxPWM = 180; // Max PWM value

// PD Constants for Speed Control
float Kp_speed = 1.5, Kd_speed = 0.05;

// PID Constants for Position Control
float Kp_pos = 2.0, Ki_pos = 0.02, Kd_pos = 0.1;

// Position and Speed Variables
long targetPosition = 5000; // Target encoder counts
long prevEnc1 = 0, prevEnc2 = 0;
float speed1 = 0, speed2 = 0;
float prevError1 = 0, prevError2 = 0;
unsigned long lastTime = 0;

void setup() {
    pinMode(MOTOR1_PWM, OUTPUT);
    pinMode(MOTOR1_DIR, OUTPUT);
    pinMode(MOTOR2_PWM, OUTPUT);
    pinMode(MOTOR2_DIR, OUTPUT);
    Serial.begin(115200);
}

void loop() {
    unsigned long currentTime = millis();
    float deltaTime = (currentTime - lastTime) / 1000.0; // Time in seconds
    lastTime = currentTime;
    
    long enc1 = encoder1.read();
    long enc2 = encoder2.read();
    
    speed1 = ((enc1 - prevEnc1) / (float)encoderPPR) * wheelCircumference / deltaTime;
    speed2 = ((enc2 - prevEnc2) / (float)encoderPPR) * wheelCircumference / deltaTime;
    
    prevEnc1 = enc1;
    prevEnc2 = enc2;
    
    // PD Speed Control
    float pwm1 = PD_SpeedControl(targetSpeed, speed1, prevError1);
    float pwm2 = PD_SpeedControl(targetSpeed, speed2, prevError2);
    
    // PID Position Control (Only when near the target)
    if (abs(targetPosition - enc1) < 500 || abs(targetPosition - enc2) < 500) {
        pwm1 = PID_PositionControl(targetPosition, enc1);
        pwm2 = PID_PositionControl(targetPosition, enc2);
    }
    
    setMotorSpeed(MOTOR1_PWM, MOTOR1_DIR, pwm1);
    setMotorSpeed(MOTOR2_PWM, MOTOR2_DIR, pwm2);
}

float PD_SpeedControl(float target, float current, float &prevError) {
    float error = target - current;
    float derivative = error - prevError;
    prevError = error;
    float output = Kp_speed * error + Kd_speed * derivative;
    return constrain(output, -maxPWM, maxPWM);
}

float PID_PositionControl(long target, long current) {
    static float integral = 0;
    float error = target - current;
    integral += error;
    float derivative = error - prevError1;
    prevError1 = error;
    float output = Kp_pos * error + Ki_pos * integral + Kd_pos * derivative;
    return constrain(output, -maxPWM, maxPWM);
}

void setMotorSpeed(int pwmPin, int dirPin, float pwmValue) {
    digitalWrite(dirPin, pwmValue > 0 ? HIGH : LOW);
    analogWrite(pwmPin, abs(pwmValue));
}
