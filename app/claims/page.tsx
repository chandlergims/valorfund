"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ClaimsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    email: "",
    solanaWallet: "",
    details: "",
    isAnonymous: false,
    agreedToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      setSubmitMessage("Please agree to the good faith declaration");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await addDoc(collection(db, "claims"), {
        name: formData.isAnonymous ? "Anonymous" : formData.name,
        branch: formData.branch,
        email: formData.email,
        solanaWallet: formData.solanaWallet,
        details: formData.details,
        isAnonymous: formData.isAnonymous,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSubmitMessage("Claim submitted successfully! Redirecting...");
      
      // Redirect to homepage after 1 second
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error submitting claim:", error);
      setSubmitMessage("Error submitting claim. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">Submit a Claim</h1>
          <p className="text-sm text-gray-600">
            Request financial assistance by submitting your info
          </p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none transition-all"
                placeholder="John Doe"
                required
                disabled={formData.isAnonymous}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none transition-all"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={formData.solanaWallet}
                onChange={(e) => setFormData({ ...formData, solanaWallet: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none transition-all font-mono"
                placeholder="Enter your Solana wallet address"
                required
              />
              <p className="text-xs text-gray-500 mt-1">We'll send payments to this address if your claim is approved</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Service Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black cursor-pointer focus:outline-none transition-all"
                required
              >
                <option value="">Select your branch</option>
                <option value="army">Army</option>
                <option value="navy">Navy</option>
                <option value="air-force">Air Force</option>
                <option value="marines">Marines</option>
                <option value="coast-guard">Coast Guard</option>
                <option value="space-force">Space Force</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Proof of Service (Optional)
              </label>
              <input
                type="file"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer focus:outline-none transition-all"
                multiple
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Details of Need
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none transition-all resize-none"
                placeholder="Please describe your situation and how we can help..."
                required
              ></textarea>
            </div>

            {/* Anonymous Option */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:outline-none cursor-pointer"
              />
              <label htmlFor="anonymous" className="ml-3 text-sm font-medium text-black cursor-pointer">
                Keep my information anonymous (your name will be hidden from our UI)
              </label>
            </div>

            {/* Good Faith Declaration */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:outline-none cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="ml-3 text-xs font-medium text-black cursor-pointer">
                  <span className="font-bold">Good Faith Declaration:</span> I hereby declare that the information I am providing is true and accurate to the best of my knowledge. I understand that this platform operates on trust and that I am who I claim to be. I acknowledge that providing false information undermines the mission to help veterans in need.
                </label>
              </div>
            </div>

            {submitMessage && (
              <div className={`p-5 rounded-lg text-center ${
                submitMessage.includes("success") 
                  ? "bg-green-50 text-green-900 border-2 border-green-200" 
                  : "bg-red-50 text-red-900 border-2 border-red-200"
              }`}>
                <p className="text-sm font-bold">{submitMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
