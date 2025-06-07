// Root file: app/page.tsx or pages/index.tsx depending on framework
// This version assumes you're using Next.js with TypeScript and Tailwind
// Replace with your Stripe keys and later plug in AI logic

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_YourStripePublicKeyHere");

export default function MedicalTourismAI() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    country: "",
    symptoms: "",
    medicalHistory: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);
    const plan = `Based on your symptoms (${form.symptoms}), we suggest a consultation at Acibadem or Medipol in Istanbul. Estimated cost: $1,200. Includes diagnostics and 3 days of care.`;
    setTimeout(() => {
      setTreatmentPlan(plan);
      setLoading(false);
      setPaymentReady(true);
    }, 2000);
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: "price_YourStripePriceIDHere", quantity: 1 }],
      mode: "payment",
      successUrl: window.location.href + "?success=true",
      cancelUrl: window.location.href + "?canceled=true",
    });
    if (error) console.error(error);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Personalized Treatment Plan", 10, 10);
    doc.text(`Name: ${form.name}`, 10, 20);
    doc.text(`Age: ${form.age}`, 10, 30);
    doc.text(`Country: ${form.country}`, 10, 40);
    doc.text(`Symptoms: ${form.symptoms}`, 10, 50);
    doc.text(`Medical History: ${form.medicalHistory}`, 10, 60);
    doc.text("Plan:", 10, 80);
    doc.text(treatmentPlan, 10, 90);
    doc.save("treatment_plan.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Turkey Medical Match</h1>
      <Card>
        <CardContent className="space-y-4">
          {!submitted ? (
            <>
              <Input placeholder="Full Name" name="name" value={form.name} onChange={handleChange} />
              <Input placeholder="Age" name="age" value={form.age} onChange={handleChange} />
              <Input placeholder="Country of Residence" name="country" value={form.country} onChange={handleChange} />
              <Textarea placeholder="Describe your symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} />
              <Textarea placeholder="Brief medical history (optional)" name="medicalHistory" value={form.medicalHistory} onChange={handleChange} />
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Find My Treatment"}
              </Button>
            </>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Personalized Treatment Plan</h2>
              {loading ? (
                <p>Generating treatment plan...</p>
              ) : (
                <div className="bg-gray-100 p-4 rounded-xl shadow-inner">
                  <p>{treatmentPlan}</p>
                  {paymentReady && (
                    <>
                      <Button className="mt-4" onClick={handlePayment}>Pay $5 to Download PDF</Button>
                      <Button className="mt-2" variant="outline" onClick={downloadPDF}>Download PDF (Preview)</Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
