"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";

export default function CharitiesPage() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const charities = [
    {
      name: "Operation Homefront",
      logo: "/OH-Logo.png",
      description: "Provides critical financial assistance, transitional and permanent housing, and family support services to prevent veteran homelessness.",
      website: "https://operationhomefront.org",
      cryptoLink: "https://operationhomefront.org/donate-cryptocurrency/"
    },
    {
      name: "Wounded Warrior Project",
      logo: "/Wounded_Warrior_Project_logo.svg.png",
      description: "Offers programs and services to help injured veterans with mental health support, career counseling, and long-term rehabilitative care.",
      website: "https://www.woundedwarriorproject.org",
      cryptoLink: "https://www.woundedwarriorproject.org/donate/cryptocurrency"
    },
    {
      name: "Fisher House Foundation",
      logo: "/logo.png",
      description: "Builds comfort homes where military and veteran families can stay free of charge while a loved one receives medical treatment.",
      website: "https://www.fisherhouse.org",
      cryptoLink: "https://www.google.com/search?q=fisher+house+foundation+crypto+donation"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-black mb-2 text-center">Our Partner Charities</h1>
        <p className="text-sm text-gray-600 mb-12 text-center">Supporting veterans through trusted organizations</p>

        {/* Charity Carousel */}
        <div className="relative mb-12">
          {/* Left Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? charities.length - 1 : prev - 1))}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/30 hover:bg-gray-700/40 text-white p-2 rounded-full transition-all cursor-pointer"
            aria-label="Previous charity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Charity Cards */}
          <div className="overflow-visible px-16">
            <div className="flex gap-6 justify-center items-stretch">
              {charities.map((charity, idx) => (
                <div 
                  key={idx} 
                  className={`flex-shrink-0 w-80 bg-white border rounded-xl p-8 transition-all duration-300 flex flex-col ${
                    idx === currentIndex 
                      ? 'border-gray-300 shadow-lg scale-105 opacity-100' 
                      : 'border-gray-200 shadow-sm scale-95 opacity-50'
                  }`}
                >
                  <div className="mb-6 flex justify-center">
                    <img src={charity.logo} alt={charity.name} className="w-24 h-24 object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 text-center">{charity.name}</h3>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed flex-1">{charity.description}</p>
                  <div className="space-y-2">
                    <a
                      href={charity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs font-semibold text-black border-2 border-black px-4 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors"
                    >
                      Visit Website
                    </a>
                    <a
                      href={charity.cryptoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-xs font-semibold text-white bg-black px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Donate Crypto
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev === charities.length - 1 ? 0 : prev + 1))}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-600/30 hover:bg-gray-700/40 text-white p-2 rounded-full transition-all cursor-pointer"
            aria-label="Next charity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Add More Charities */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-bold text-black mb-2">Want to Add Your Charity?</h2>
          <p className="text-sm text-gray-600 mb-4">
            We're always looking to partner with more veteran-focused organizations.
          </p>
          <a
            href="https://x.com/valorfundbonk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-semibold text-white bg-black px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            DM us on X
          </a>
        </div>
      </div>
    </div>
  );
}
