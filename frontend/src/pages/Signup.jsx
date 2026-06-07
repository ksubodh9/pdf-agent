import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    const { error: err } = await signUp(email, password, fullName);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-sm text-slate-500 mb-6">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link to="/login">
            <Button className="w-full">Go to login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-3">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PDF Agent</h1>
          <p className="text-sm text-slate-500 mt-1">AI-powered document intelligence</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Create an account</CardTitle>
            <CardDescription>Free to start — no credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
