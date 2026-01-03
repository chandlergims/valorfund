"use client";

import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [claims, setClaims] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [currentCharityIndex, setCurrentCharityIndex] = useState(1);
  const [stats, setStats] = useState({
    totalDonated: 0,
    charitiesSupported: 3,
    veteransHelped: 0,
  });

  const charities = [
    { 
      name: "Operation Homefront", 
      amount: 12500, 
      description: "Military family support",
      cryptoLink: "https://operationhomefront.org/donate-cryptocurrency/"
    },
    { 
      name: "Wounded Warrior Project", 
      amount: 8750, 
      description: "Veteran rehabilitation",
      cryptoLink: "https://www.woundedwarriorproject.org/donate/cryptocurrency"
    },
    { 
      name: "Fisher House Foundation", 
      amount: 6200, 
      description: "Housing for military families",
      cryptoLink: "https://www.google.com/search?q=fisher+house+foundation+crypto+donation"
    },
  ];

  useEffect(() => {
    // Load claims
    const qClaims = query(
      collection(db, "claims"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribeClaims = onSnapshot(qClaims, (snapshot) => {
      const claimsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClaims(claimsData);
    });

    // Load donations
    const qDonations = query(
      collection(db, "donations"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribeDonations = onSnapshot(qDonations, (snapshot) => {
      const donationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(donationsData);
    });

    // Load payments
    const qPayments = query(
      collection(db, "payments"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
      const paymentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(paymentsData);
    });

    // Load stats
    const loadStats = async () => {
      const { doc: docRef, getDoc } = await import("firebase/firestore");
      const statsDoc = await getDoc(docRef(db, "settings", "stats"));
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as any);
      }
    };
    loadStats();

    return () => {
      unsubscribeClaims();
      unsubscribeDonations();
      unsubscribePayments();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* USD1 Project Banner */}
        <div className="text-center mb-8">
          <a href="#wlfi-vision" className="flex justify-center items-center gap-4 mb-3 cursor-pointer">
            <img src="/wlfi.png" alt="WLFI" className="h-8 object-contain hover:opacity-80 transition-opacity" />
            <img src="/usd1.png" alt="USD1" className="h-8 object-contain hover:opacity-80 transition-opacity" />
          </a>
          <p className="text-sm font-semibold text-gray-600 mb-1">The first USD1 project supporting a cause</p>
          <h1 className="text-4xl font-bold text-black">Supporting Our Veterans</h1>
          <p className="text-sm font-bold text-gray-600 mt-2">WLFI Support-a-Cause — Batch 1</p>
        </div>

        {/* Partner Charities Carousel - Top Section */}
        <div className="relative mb-12">
          {/* Left Arrow */}
          <button
            onClick={() => setCurrentCharityIndex((prev) => (prev === 0 ? charities.length - 1 : prev - 1))}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/30 hover:bg-gray-700/40 text-white p-2 rounded-full transition-all cursor-pointer"
            aria-label="Previous charity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Charity Cards Container */}
          <div className="overflow-visible px-16">
            <div className="flex gap-4 justify-center items-center">
              {charities.map((charity, idx) => (
                <div 
                  key={idx} 
                  className={`flex-shrink-0 w-72 bg-white border rounded-xl p-6 transition-all duration-300 ${
                    idx === currentCharityIndex 
                      ? 'border-gray-300 shadow-lg scale-105 opacity-100' 
                      : 'border-gray-200 shadow-sm scale-95 opacity-50'
                  }`}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="w-24 h-24 rounded-lg flex items-center justify-center">
                      {charity.name === "Fisher House Foundation" && (
                        <img src="/logo.png" alt="Fisher House Foundation" className="w-20 h-20 object-contain" />
                      )}
                      {charity.name === "Operation Homefront" && (
                        <img src="/OH-Logo.png" alt="Operation Homefront" className="w-20 h-20 object-contain" />
                      )}
                      {charity.name === "Wounded Warrior Project" && (
                        <img src="/Wounded_Warrior_Project_logo.svg.png" alt="Wounded Warrior Project" className="w-20 h-20 object-contain" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-black mb-2 text-center">{charity.name}</h3>
                  <p className="text-xs text-gray-600 mb-4 text-center line-clamp-2">{charity.description}</p>
                  <div className="text-center">
                    <a
                      href={charity.cryptoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-semibold text-white bg-black px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Donate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentCharityIndex((prev) => (prev === charities.length - 1 ? 0 : prev + 1))}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/30 hover:bg-gray-700/40 text-white p-2 rounded-full transition-all cursor-pointer"
            aria-label="Next charity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation - Centered with contained border */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-8 py-3.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "all"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("charities")}
              className={`px-8 py-3.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "charities"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              Charities
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-8 py-3.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "donations"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              Donations
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={`px-8 py-3.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                activeTab === "claims"
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              Claims
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {activeTab === "all" && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-xs text-gray-600 mb-1">Total Donated</p>
                  <p className="text-2xl font-bold text-black">${stats.totalDonated.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-xs text-gray-600 mb-1">Charities Supported</p>
                  <p className="text-2xl font-bold text-black">{stats.charitiesSupported}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-xs text-gray-600 mb-1">Veterans Helped</p>
                  <p className="text-2xl font-bold text-black">{stats.veteransHelped}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-black">Recent Activity</h2>
                
                {/* Transaction Types Legend - Horizontal */}
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <p className="text-xs text-gray-600">Donation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <p className="text-xs text-gray-600">Request</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-xs text-gray-600">Payment</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {[
                  ...donations.map(d => ({ ...d, type: 'donation', timestamp: d.createdAt })),
                  ...claims.filter(c => c.status === "pending").map(c => ({ ...c, type: 'request', timestamp: c.createdAt })),
                  ...payments.map(p => ({ ...p, type: 'payment', timestamp: p.createdAt }))
                ]
                .sort((a, b) => {
                  const timeA = a.timestamp?.seconds || 0;
                  const timeB = b.timestamp?.seconds || 0;
                  return timeB - timeA; // newest first
                })
                .map((item, idx) => {
                  if (item.type === 'donation') {
                    return (
                      <div key={`donation-${item.id}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-500 text-white">DONATION</span>
                              <p className="text-sm font-semibold text-black">{item.charity}</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                            </p>
                            {item.solscanLink && (
                              <a href={item.solscanLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                Transaction link
                              </a>
                            )}
                          </div>
                          {item.amount && <p className="text-sm font-bold text-black">${item.amount.toLocaleString()}</p>}
                        </div>
                      </div>
                    );
                  } else if (item.type === 'request') {
                    return (
                      <div key={`request-${item.id}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500 text-white">REQUEST</span>
                              <p className="text-sm font-semibold text-black">{item.name || "Anonymous"} - {item.branch?.charAt(0).toUpperCase() + item.branch?.slice(1).replace(/-/g, ' ')}</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">id: {item.id}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const relatedClaim = claims.find(c => c.id === item.claimId);
                    return (
                      <div key={`payment-${item.id}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500 text-white">PAYMENT</span>
                              <p className="text-sm font-semibold text-black">
                                {relatedClaim ? `${relatedClaim.name || "Anonymous"} - ${relatedClaim.branch?.charAt(0).toUpperCase() + relatedClaim.branch?.slice(1).replace(/-/g, ' ')}` : "Claim Payment"}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mb-1">id: {item.claimId}</p>
                            {item.solscanLink && (
                              <a href={item.solscanLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                Transaction link
                              </a>
                            )}
                          </div>
                          {item.amount && <p className="text-sm font-bold text-black">${item.amount.toLocaleString()}</p>}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              {/* WLFI Vision Section */}
              <div id="wlfi-vision" className="bg-white border border-gray-200 rounded-lg p-6 mt-8 mb-16">
                <h3 className="text-base font-bold text-black mb-4">USD1 Meets WLFI: The First Support-a-Cause Project</h3>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p>
                    <strong>World Liberty Financial (WLFI)</strong> has positioned itself around sovereignty, liberty, and restoring agency where existing systems fall short. Their vision is to use modern financial infrastructure to empower individuals and reduce dependence on slow, opaque intermediaries.
                  </p>
                  <p>
                    <strong>USD1</strong> represents stable, transparent value that can flow where traditional systems create friction. By combining USD1's accessibility with WLFI's mission, we're creating something unprecedented.
                  </p>
                  <p className="pt-2 border-t border-gray-200">
                    <strong>We are the first project applying to WLFI Support-a-Cause — Batch 1.</strong> To date, no Support-a-Cause project has directly addressed one of the clearest real-world failures in the current system: <strong>former service members who carried the cost of war but did not receive adequate or timely financial compensation.</strong>
                  </p>
                  <p>
                    This platform builds a <strong>transparent funding mechanism</strong> focused on veterans who experienced underpayment, delayed compensation, or long-term income loss related to military service. This is not framed as charity—it's addressing an <strong>unresolved obligation</strong> created by service.
                  </p>
                  <p>
                    By leveraging USD1 and WLFI's infrastructure, we restore individual agency to veterans, accelerate settlements, and provide complete transparency through blockchain verification. Every transaction is recorded, every dollar is tracked, and every veteran supported is a step toward fulfilling a promise that should never have been delayed.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "charities" && (
            <>
              <h2 className="text-lg font-semibold text-black mb-4">Partner Charities</h2>
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {charities.map((charity, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-black mb-1">{charity.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
                        <p className="text-xs text-gray-500 mb-3">Total donated: ${charity.amount.toLocaleString()}</p>
                        <a
                          href={charity.cryptoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs font-semibold text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          Donate Crypto
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "donations" && (
            <>
              <h2 className="text-lg font-semibold text-black mb-4">All Donations</h2>
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
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
            </>
          )}

          {activeTab === "claims" && (
            <>
              <h2 className="text-lg font-semibold text-black mb-4">All Claims & Payments</h2>
              <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                {claims.length === 0 && payments.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-600">No claims submitted yet</p>
                  </div>
                ) : (
                  [
                    ...claims.filter(c => c.status === "pending").map(c => ({ ...c, type: 'request', timestamp: c.createdAt })),
                    ...payments.map(p => ({ ...p, type: 'payment', timestamp: p.createdAt }))
                  ]
                  .sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA;
                  })
                  .map((item) => {
                    if (item.type === 'request') {
                      return (
                        <div key={`request-${item.id}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-500 text-white">REQUEST</span>
                                <p className="text-sm font-semibold text-black">{item.name || "Anonymous"} - {item.branch?.charAt(0).toUpperCase() + item.branch?.slice(1).replace(/-/g, ' ')}</p>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                              </p>
                              <p className="text-xs text-gray-500 font-mono">id: {item.id}</p>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      const relatedClaim = claims.find(c => c.id === item.claimId);
                      return (
                        <div key={`payment-${item.id}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500 text-white">PAYMENT</span>
                                <p className="text-sm font-semibold text-black">
                                  {relatedClaim ? `${relatedClaim.name || "Anonymous"} - ${relatedClaim.branch?.charAt(0).toUpperCase() + relatedClaim.branch?.slice(1).replace(/-/g, ' ')}` : "Claim Payment"}
                                </p>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'short' }) + ' EST' : "Just now"}
                              </p>
                              <p className="text-xs text-gray-500 font-mono mb-1">id: {item.claimId}</p>
                              {item.solscanLink && (
                                <a href={item.solscanLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                  Transaction link
                                </a>
                              )}
                            </div>
                            {item.amount && <p className="text-sm font-bold text-black">${item.amount.toLocaleString()}</p>}
                          </div>
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
