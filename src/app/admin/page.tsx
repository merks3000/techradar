import Link from "next/link";

export default function Index({ Component, pageProps }: any) {
    return (
        <main className="mx-auto max-w-4xl px-4 py-8">
            <div className="pt-2">
                <Link href="/admin/new">
                    <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Neue Technologie erfassen
                    </button>
                </Link>
            </div>
            <div className="pt-2">
                <Link href="/admin/manage">
                    <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Technologien verwalten
                    </button>
                </Link>
            </div>
        </main>


    )
}