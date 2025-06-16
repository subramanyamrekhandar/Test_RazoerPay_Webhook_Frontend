import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

function App() {
  const [userId, setUserId] = useState("abc123");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);


  console.log("BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
  console.log("RAZORPAY_KEY_ID:", process.env.REACT_APP_RAZORPAY_KEY_ID);

  const handleTopup = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/create-order`, {
        user_id: userId,
        amount: amount,
      });

      const order = res.data;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "NAMUNAH AI",
        description: "Wallet Top-up",
        order_id: order.id,
        handler: function (response) {
          alert("✅ Payment successful!");
          fetchWallet();
        },
        notes: {
          user_id: userId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Failed to create Razorpay order");
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/wallet/${userId}`);
      setBalance(res.data.balance);
    } catch (e) {
      console.error("Failed to fetch wallet");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>💰 Razorpay Wallet Top-up</h2>
      <label>User ID:</label>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ margin: 5 }}
      />
      <br />
      <label>Amount (INR):</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ margin: 5 }}
      />
      <br />
      <button onClick={handleTopup} style={{ marginTop: 10 }}>
        🔁 Top-up Wallet
      </button>

      <br />
      <button onClick={fetchWallet} style={{ marginTop: 10 }}>
        📦 Check Wallet Balance
      </button>

      {balance !== null && (
        <h3 style={{ color: "green" }}>
          Current Balance: ₹{balance.toFixed(2)}
        </h3>
      )}
    </div>
  );
}

export default App;
