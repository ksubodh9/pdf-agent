import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { supabaseConfigured } from "@/lib/supabase";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";

// Shown when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY weren't set at build time
function MissingConfigScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-amber-200 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold">!</div>
          <h1 className="text-xl font-semibold text-slate-900">Supabase not configured</h1>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          The app needs Supabase credentials to run. Set these environment variables before building:
        </p>
        <pre className="bg-slate-900 text-emerald-400 rounded-lg p-4 text-xs overflow-x-auto mb-4">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
        </pre>
        <p className="text-slate-500 text-xs">
          See <span className="font-mono">SUPABASE_SETUP.md</span> for full instructions.
          For Docker: pass these as build args in <span className="font-mono">docker-compose.yml</span>.
        </p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  if (!supabaseConfigured) return <MissingConfigScreen />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}
