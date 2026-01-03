"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "donations"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(donationsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-black mb-6">All Donations</h1>
        
        <div className="space-y-4">
          {donations.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-600">No donations recorded yet</p>
            </div>
          ) : (
            donations.map((donation) => (
              <div key={donation.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-500 text-white">DONATION</span>
                      <p className="text-sm font-semibold text-black">{donation.charity}</p>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {donation.createdAt ? new Date(donation.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                    </p>
                    {donation.solscanLink && (
                      <a href={donation.solscanLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        Transaction link
                      </a>
                    )}
                  </div>
                  {donation.amount && <p className="text-sm font-bold text-black">${donation.amount.toLocaleString()}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
