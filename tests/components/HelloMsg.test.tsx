import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import HelloMsg from "@/components/hello-msg";
import React from "react";


const wrap = (session?: any) =>
    ({ children }: any) =>
        <SessionProvider session={session}>{children}</SessionProvider>;

it("zeigt nichts ohne Session", () => {
    render(<HelloMsg />, { wrapper: wrap() });
    expect(screen.queryByText(/Hello, /)).toBeNull();
});

it("zeigt Name mit Session", () => {
    render(<HelloMsg />, { wrapper: wrap({ user: { name: "Alice" } }) });
    expect(screen.getByText("Hello, Alice!")).toBeInTheDocument();
});
