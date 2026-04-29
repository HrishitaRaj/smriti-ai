import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type Mode = "login" | "signup";

interface LoginModalProps {
  triggerText?: string;
  initialMode?: Mode;
  trigger?: React.ReactNode;
}

const LoginModal: React.FC<LoginModalProps> = ({
  triggerText = "Login",
  initialMode = "login",
  trigger,
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (): Promise<boolean> => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return false;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (mode === "signup" && !name) {
      setError("Please provide your name");
      return false;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // set displayName from provided name
        if (userCred.user) {
          try {
            await updateProfile(userCred.user, { displayName: name || undefined });
          } catch (err) {
            console.warn("updateProfile failed", err);
          }
        }
        // For now we just log extra fields; later persist to Firestore if desired
        console.log({ name, age, gender, address, phone });
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setAge("");
      setGender("");
      setAddress("");
      setPhone("");

      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await handleAuth();
    if (ok) {
      setOpen(false);
      navigate("/chat");
    }
  };

  const handleGoogleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    console.log("Google user:", result.user);
  } catch (err: any) {
    setError(err.message);
  }

  setLoading(false);
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant={triggerText === "Sign up" ? "default" : "outline"}
            size="lg"
            className="border border-input"
          >
            {triggerText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Log in" : "Create an account"}</DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your credentials to continue."
              : "Create an account to save memories and preferences."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          <form className="grid gap-4 py-2 grid-cols-1 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2 grid gap-1">
              <label className="text-sm text-muted-foreground">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="md:col-span-2 grid gap-1">
              <label className="text-sm text-muted-foreground">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {mode === "signup" && (
              <>
                <div className="grid gap-1">
                  <label className="text-sm text-muted-foreground">Name</label>
                  <Input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-muted-foreground">Age</label>
                  <Input type="number" placeholder="e.g. 72" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-muted-foreground">Gender</label>
                  <select className="rounded-md border border-input bg-background px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="md:col-span-2 grid gap-1">
                  <label className="text-sm text-muted-foreground">Address</label>
                  <Input type="text" placeholder="Street, City, State" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm text-muted-foreground">Phone number</label>
                  <Input type="tel" placeholder="+91 99999 99999" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="md:col-span-2 grid gap-1">
                  <label className="text-sm text-muted-foreground">Confirm password</label>
                  <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-500 text-center md:col-span-2">{error}</p>}

            <div className="md:col-span-2">
              <DialogFooter>
                <div className="flex gap-2 w-full">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create Account"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Switch to Sign up" : "Switch to Log in"}</Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </div>

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
