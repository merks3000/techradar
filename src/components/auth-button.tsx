import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function AuthButton({
    variant = "desktop",
    onClickItem,
}: Readonly<{
    variant?: "desktop" | "mobile";
    onClickItem?: () => void;
}>) {
    const { data: session, status } = useSession();

    const base =
        variant === "desktop"
            ? "rounded-md px-4 py-2 text-sm font-semibold transition"
            : "block rounded-md px-3 py-2 text-base font-semibold transition";

    if (status === "loading") {
        return (
            <span className={variant === "desktop" ? "px-4 py-2 text-sm" : "px-3 py-2 text-base"}>
                …
            </span>
        );
    }

    return session ? (
        <button
            onClick={async () => {
                await signOut({ callbackUrl: "/" });
                onClickItem?.();
            }}
            className={`${base} bg-blue-600 text-white hover:bg-blue-700`}
        >
            Logout
        </button>
    ) : (
        <Link
            href="/signin"
            onClick={onClickItem}
            className={`${base} bg-blue-600 text-white hover:bg-blue-700`}
        >
            Login
        </Link>
    );
}
