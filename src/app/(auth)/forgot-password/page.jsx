"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Check your inbox for a password reset link.");
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900">Forgot your password?</h2>
        <p className="text-sm text-gray-600 text-center mt-2">We’ll send you a reset link via email.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4 text-blue-500" /> Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className={isSubmitting ? "opacity-70 pointer-events-none" : ""}
            variant="primary"
            size="lg"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Remembered your password?{" "}
          <a href="/login" className="text-[#2A2C7B] hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </main>
  );
}
