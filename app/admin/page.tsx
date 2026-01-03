"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalDonated: 0,
    charitiesSupported: 3,
    veteransHelped: 0,
  });

  const [transactionType, setTransactionType] = useState<"donation" | "claim">("donation");
  const [claimId, setClaimId] = useState("");
  const [charity, setCharity] = useState("");
  const [amount, setAmount] = useState("");
  const [solscanLink, setSolscanLink] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    // Load stats from Firebase
    const loadStats = async () => {
      const statsDoc = await getDoc(doc(db, "settings", "stats"));
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as any);
      }
    };
    loadStats();
  }, []);

  const handleUpdateStats = async () => {
    try {
      await setDoc(doc(db, "settings", "stats"), stats);
      setSubmitMessage("Stats updated successfully!");
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (error) {
      console.error("Error updating stats:", error);
      setSubmitMessage("Error updating stats");
    }
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");

    try {
      if (transactionType === "claim") {
        // Create a NEW payment transaction (don't update the claim)
        await addDoc(collection(db, "payments"), {
          claimId: claimId,
          amount: parseFloat(amount),
          solscanLink: solscanLink,
          type: "payment",
          createdAt: serverTimestamp(),
        });
        setSubmitMessage("Payment transaction created!");
      } else {
        // Add donation transaction
        await addDoc(collection(db, "donations"), {
          charity,
          amount: parseFloat(amount),
          solscanLink,
          type: "donation",
          createdAt: serverTimestamp(),
        });
        setSubmitMessage("Donation transaction added!");
      }

      // Clear form
      setClaimId("");
      setCharity("");
      setAmount("");
      setSolscanLink("");
      
      setTimeout(() => setSubmitMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setSubmitMessage("Error submitting transaction. Check claim ID.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-black mb-8">Admin Dashboard</h1>

        {/* Stats Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-black mb-6">Edit Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Total Donated ($)
              </label>
              <input
                type="number"
                value={stats.totalDonated}
                onChange={(e) => setStats({ ...stats, totalDonated: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Charities Supported
              </label>
              <input
                type="number"
                value={stats.charitiesSupported}
                onChange={(e) => setStats({ ...stats, charitiesSupported: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Veterans Helped
              </label>
              <input
                type="number"
                value={stats.veteransHelped}
                onChange={(e) => setStats({ ...stats, veteransHelped: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateStats}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Update Stats
          </button>
        </div>

        {/* Transaction Submission */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-black mb-6">Submit Transaction</h2>

          <form onSubmit={handleSubmitTransaction} className="space-y-6">
            {/* Transaction Type Selector */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Transaction Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTransactionType("donation")}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    transactionType === "donation"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Donation
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("claim")}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    transactionType === "claim"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  Claim Payment
                </button>
              </div>
            </div>

            {/* Conditional Fields */}
            {transactionType === "claim" ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Claim ID
                  </label>
                  <input
                    type="text"
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none font-mono"
                    placeholder="Paste claim ID from Recent Activity"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Charity
                  </label>
                  <select
                    value={charity}
                    onChange={(e) => setCharity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
                    required
                  >
                    <option value="">Select charity</option>
                    <option value="Operation Homefront">Operation Homefront</option>
                    <option value="Wounded Warrior Project">Wounded Warrior Project</option>
                    <option value="Fisher House Foundation">Fisher House Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </>
            )}

            {/* Solscan Link */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Solscan Transaction Link
              </label>
              <input
                type="url"
                value={solscanLink}
                onChange={(e) => setSolscanLink(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none"
                placeholder="https://solscan.io/tx/..."
                required
              />
            </div>

            {submitMessage && (
              <div className={`p-5 rounded-lg text-center ${
                submitMessage.includes("success") || submitMessage.includes("added") || submitMessage.includes("paid")
                  ? "bg-green-50 text-green-900 border-2 border-green-200" 
                  : "bg-red-50 text-red-900 border-2 border-red-200"
              }`}>
                <p className="text-sm font-bold">{submitMessage}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              {transactionType === "claim" ? "Mark Claim as Paid" : "Submit Donation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
