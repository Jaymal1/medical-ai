// app/page.tsx
"use client";

import React, { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [treatmentPlan, setTreatmentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Mocking AI logic for demo
    setTimeout(() => {
      setTreatmentPlan(
        `Dear ${name}, based on your symptoms: "${symptoms}", we suggest a diagnostic MRI and consultation at Anadolu Medical Center, Istanbul. Estimated cost: $250.`
      );
      setLoading(false);
    }, 1500);
  };

  const handlePayment = () => {
    // For demo purposes, we just simulate success
    setPaid(true);
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Medical AI for Foreigners</h1>
      <p className="text-center text-gray-600">
        Find affordable healthcare in Turkey. Fill the form, and get a personalized treatment plan.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Describe your symptoms"
          className="w-full p-2 border rounded"
          rows={4}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full p-2 rounded disabled:bg-blue-300"
          disabled={loading || !name || !symptoms}
        >
          {loading ? "Analyzing..." : "Generate Treatment Plan"}
        </button>
      </div>

      {treatmentPlan && !paid && (
        <div className="p-4 border rounded bg-yellow-100">
          <p className="mb-2">Treatment plan ready! Pay $5 to download it.</p>
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white p-2 rounded"
          >
            Pay $5
          </button>
        </div>
      )}

      {paid && treatmentPlan && (
        <div className="p-4 border rounded bg-green-100">
          <h2 className="font-semibold">Your Treatment Plan</h2>
          <p className="mt-2 whitespace-pre-line">{treatmentPlan}</p>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(treatmentPlan)}`}
            download="treatment-plan.txt"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Plan
          </a>
        </div>
      )}
    </main>
  );
}
