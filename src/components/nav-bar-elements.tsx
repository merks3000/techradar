"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

export function useNavElementsBasedOnSession() {
    const { data: session, status } = useSession();

    return useMemo(() => {
        if (status !== "authenticated" || !session?.user) {
            return [{ href: "/", label: "Radar" }] as const;
        }
        return (session.user as any).role === "cto" || (session.user as any).role === "tech-lead"
            ? [
                { href: "/", label: "Radar" },
                { href: "/admin/new", label: "Technologie hinzufügen" },
                { href: "/admin/manage", label: "Technologien verwalten" },
            ]
            : [{ href: "/", label: "Radar" }];
    }, [session, status]);
}

export function NavBarElements() {
    const navItems = useNavElementsBasedOnSession();
    const pathname = usePathname();

    return (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition ${pathname === item.href
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                        }`}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
}

export function MobileNavBarElements({
    onItemClick,
}: { readonly onItemClick: () => void }) {
    const navItems = useNavElementsBasedOnSession();
    const pathname = usePathname();

    return (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick} // <-- Parent schließen
                    className={`block rounded-md px-3 py-2 text-base font-medium transition ${pathname === item.href
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );
}
