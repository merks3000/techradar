import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const users = [
    {
        id: "1",
        name: "Mr Boss",
        email: "cto@techradar.com",
        // hash von "mrboss123"
        passwordHash: "$2b$10$cCVyzAXQjxbKH/HE8iSmBu1nHnL23p6A4/r5jxXtCD/XMH40Qcwou",
        role: "cto",
    },
    {
        id: "2",
        name: "Tech Leader",
        email: "techlead@techradar.com",
        // hash von "techleader123"
        passwordHash: "$2b$10$JDeltdfA89CjWS3ahmO4A.na3XyEToqEorxJ/Tb7nV44ghPMVJaOS",
        role: "tech-lead",
    },
    {
        id: "3",
        name: "Normalo User",
        email: "user@techradar.com",
        // hash von "user123"
        passwordHash: "$2b$10$bzn9mdFbKPGtlai2nPvCJuFIS0dFoy59AmDzQMyM/orb/UQ64BnUe",
        role: "user",
    },
] as const;

const CredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const authConfig: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/signin" },
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Passwort", type: "password" },
            },
            async authorize(creds) {
                const parsed = CredentialsSchema.safeParse(creds);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;
                const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
                if (!u) return null;

                const ok = await bcrypt.compare(password, u.passwordHash);
                if (!ok) return null;

                return { id: u.id, name: u.name, email: u.email, role: u.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role;
            return token;
        },
        async session({ session, token }) {
            if (session.user) (session.user as any).role = token.role;
            return session;
        },
        authorized({ auth, request }) {
            const path = request.nextUrl.pathname;
            if (path.startsWith("/admin")) {
                return !!auth?.user && ((auth.user as any).role === "cto" || (auth.user as any).role === "tech-lead");
            }
            return true;
        },
    },
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth(authConfig);
