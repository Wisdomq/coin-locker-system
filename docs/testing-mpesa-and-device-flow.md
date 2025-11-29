# Testing MPESA STK Push & Device Unlock Flow (Sandbox)

## Set required environment variables (GitHub secrets or your host)
- MPESA_CONSUMER_KEY
- MPESA_CONSUMER_SECRET
- MPESA_PASSKEY
- MPESA_SHORTCODE (sandbox: 174379)
- MPESA_BASE_URL (sandbox: https://sandbox.safaricom.co.ke)
- MQTT_BROKER_URL (for docker compose we use mqtt://mosquitto:1883)

### If using GitHub Actions / Deploy env:
Set the MPESA keys in your hosting provider or Docker host env.

## How the flow works (local or hosted)
1. Client (mobile/web) calls `/api/payments/mpesa/stkpush` with `phone`, `amount`, `lockerCode`.
2. Backend creates a Payment record and calls Daraja `stkpush` endpoint.
3. User receives STK Push on phone and enters PIN.
4. Safaricom Daraja sends a callback to `/api/payments/mpesa/callback`.
5. Backend processes callback, updates Payment.status, and if success, publishes an MQTT unlock message to `locker/<locker-code>/cmd`.
6. Device (ESP32) subscribed to `locker/<locker-code>/cmd` receives message and performs unlock.

## Local testing with Docker Compose
- Start services:
docker-compose up --build

- Use `POST /api/payments/mpesa/stkpush` with JSON:
```json
{ "phone":"2547XXXXXXXX", "amount":10, "lockerCode":"LKR-001" }

For Daraja sandbox, follow Safaricom's guide to configure a public callback URL (ngrok or similar) and ensure MPESA_CALLBACK_URL points to it.

Device subscribe example (ESP32)
Topic: locker/LKR-001/cmd
Message: {"cmd":"unlock","token":"ABC123","payload":{...}}

Device should verify token and unlock only if valid.



---

# 9) Set GitHub repository secrets (you must do this via GitHub UI)

Go to: **Settings → Secrets → Actions** and add:
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- (optionally) `MQTT_USERNAME`, `MQTT_PASSWORD` if you secure Mosquitto later

Also for production callback, ensure your hosting has a public URL and set `MPESA_CALLBACK_URL` accordingly.


