# FintechFlow — Personal Finance & Loan Manager

A full-stack fintech web application built with React.js and Node.js/Express.js.

## Project Description
FintechFlow allows users to manage a digital wallet (deposits/withdrawals), apply for micro-loans, view transaction history, and calculate EMIs. All data is stored in-memory on the server.

## How to Run Locally

### Backend
cd backend
npm install
node server.js

### Frontend
cd frontend
npm install
npm run dev

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wallet | Get wallet balance |
| POST | /api/wallet/deposit | Deposit amount |
| POST | /api/wallet/withdraw | Withdraw amount |
| GET | /api/wallet/transactions | Get all transactions |
| POST | /api/loans/apply | Apply for a loan |
| GET | /api/loans | Get all loans |
| PATCH | /api/loans/:id/status | Update loan status |
| GET | /api/emi-calculator | Calculate EMI |
