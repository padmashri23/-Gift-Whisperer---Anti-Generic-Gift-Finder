"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Gift, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setError("");
      setLoading(false);
      setConfirmationSent(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (confirmationSent) {
    return (
      <Card padding="lg">
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Check your email
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            We sent a confirmation link to <strong>{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Back to Sign in
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
          <Gift className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">
          Create your account
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Start finding perfect gifts
        </p>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-error dark:bg-red-950/30">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <Mail className="h-4 w-4" />
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
