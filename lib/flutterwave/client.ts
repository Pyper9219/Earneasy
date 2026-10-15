import axios from "axios";

export const flwClient = axios.create({
  baseURL: process.env.FLUTTERWAVE_BASE_URL || "https://api.flutterwave.com/v3",
  headers: {
    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 20000,
});