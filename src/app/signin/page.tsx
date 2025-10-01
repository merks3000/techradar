import LoginForm from "./login-form";

export const metadata = { title: "Anmelden" };

export default async function SignInPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ callbackUrl?: string | string[] }>;
}>) {
    const sp = await searchParams;
    const callbackUrl =
        Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl ?? "/";


    return (
        <main className="mx-auto max-w-sm py-10">
            <h1 className="text-2xl font-semibold mb-6">Anmeldung</h1>
            <LoginForm callbackUrl={callbackUrl} />
        </main>
    );
}
