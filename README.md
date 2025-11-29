# coin-locker-system
# Smart Coin Locker System (Kenya) – M-Pesa & Multi-Payment Support

A smart coin locker automation system designed for Kenya.  
Supports **M-Pesa**, Airtel Money, cash, and card payments.  
This system allows users to rent lockers securely, pay digitally, and receive an auto-generated unlock code.

## 🎯 Core Features
- Payment integration:
  - ✔ M-Pesa STK Push  
  - ✔ Airtel Money  
  - ✔ Cash  
  - ✔ Bank cards  
- Locker reservation system  
- Auto-generated unlock codes  
- Timer-based pricing  
- Admin dashboard  
- Optional IoT firmware for physical lock operation

## 🛠️ Tech Stack
- Python or Node.js  
- Flask or Express  
- M-Pesa Daraja API  
- MySQL / SQLite  
- Arduino/ESP32 firmware (optional)

## 🔐 API Endpoints

POST /pay/mpesa – trigger STK Push

POST /locker/reserve

GET /locker/status/{id}

POST /locker/unlock

## 📝 Firmware Notes

Supports serial or WiFi commands

Unlock command sent after payment confirmation

Optional OLED/LED confirmation

