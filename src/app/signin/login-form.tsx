"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm({ callbackUrl = "/" }: { readonly callbackUrl?: string }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
        setSubmitting(false);

        if (res?.ok && !res.error) window.location.href = res.url ?? callbackUrl;
        else if (res?.error === "CredentialsSignin") setError("E-Mail oder Passwort ist falsch.");
        else if (res?.error) setError(`Fehler bei der Anmeldung: ${res.error}`);
        else setError("Login fehlgeschlagen. Bitte später erneut versuchen.");
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-1">
                <label htmlFor="email">E-Mail</label>
                <input
                    id="email"
                    data-testid="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2"
                    required
                />
            </div>

            <div className="grid gap-1">
                <label htmlFor="password">Passwort</label>
                <input
                    id="password"
                    data-testid="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2"
                    required
                />
                {/* Checkbox NICHT im gleichen <label>, eigenes Label via htmlFor */}
                <div className="flex items-center gap-2 text-sm mt-1">
                    <input
                        id="showPw"
                        type="checkbox"
                        checked={showPw}
                        onChange={() => setShowPw(!showPw)}
                    />
                    <label htmlFor="showPw">Passwort anzeigen</label>
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" className="rounded px-4 py-2 border hover:bg-gray-50" disabled={submitting}>
                {submitting ? "Anmelden…" : "Anmelden"}
            </button>
        </form>
    );
}
