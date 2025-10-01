import { listPublishedTech } from "@/lib/radar";
import type { Technology, Ring, Category } from "@/lib/types";

function Badge({
    children,
    kind,
}: {
    children: React.ReactNode;
    kind: "ring" | "category";
}) {
    const base =
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

    const ringStyles: Record<Ring, string> = {
        Adopt: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
        Trial: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
        Assess: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
        Hold: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    } as const;

    const categoryStyles: Record<Category, string> = {
        Techniques: "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200",
        Platforms: "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200",
        Tools: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
        "Languages_Frameworks": "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
    } as const;

    const text = String(children);
    const style =
        kind === "ring"
            ? ringStyles[text as Ring] ?? "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
            : categoryStyles[text as Category] ??
            "bg-gray-100 text-gray-700 ring-1 ring-gray-200";

    return <span className={`${base} ${style}`}>{children}</span>;
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span aria-hidden>📭</span>
            </div>
            <p className="font-medium">Noch keine publizierten Technologien</p>
            <p className="text-sm">Sobald etwas publiziert ist, erscheint es hier.</p>
        </div>
    );
}

function TechRow({ t }: { t: Technology }) {
    const date = t.publishedAt ? new Date(t.publishedAt).toLocaleDateString() : "—";
    return (
        <tr className="border-b last:border-0">
            <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{t.name}</div>
                <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {t.techDescription}
                </div>
            </td>
            <td className="px-4 py-3">
                <Badge kind="category">{t.category as Category}</Badge>
            </td>
            <td className="px-4 py-3">
                <Badge kind="ring">{t.ring as Ring}</Badge>
            </td>
            <td className="px-4 py-3">
                <div className="line-clamp-2 text-sm text-gray-700">
                    {t.classificationNote}
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{date}</td>
        </tr>
    );
}

function TechCard({ t }: { t: Technology }) {
    const date = t.publishedAt ? new Date(t.publishedAt).toLocaleDateString() : "—";
    return (
        <article className="rounded-xl border bg-white p-4 shadow-sm">
            <header className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.techDescription}</p>
            </header>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge kind="category">{t.category as Category}</Badge>
                <Badge kind="ring">{t.ring as Ring}</Badge>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <dt className="text-gray-500">Einordnung</dt>
                    <dd className="text-gray-800">{t.classificationNote ?? "—"}</dd>
                </div>
                <div>
                    <dt className="text-gray-500">Publiziert</dt>
                    <dd className="text-gray-800">{date}</dd>
                </div>
            </dl>
        </article>
    );
}

export default async function RadarPage() {
    const items = await listPublishedTech();

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Technology Radar</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Publizierte Technologien, gruppiert nach Kategorie &amp; Ring.
                    </p>
                </div>
            </header>

            <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                {items.length === 0 ? (
                    <div className="p-8">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="md:hidden p-4">
                            <div className="grid grid-cols-1 gap-4">
                                {items.map((t: Technology) => (
                                    <TechCard key={t.id} t={t} />
                                ))}
                            </div>
                        </div>

                        <div className="hidden md:block overflow-x-auto w-full">
                            <table className="w-full table-fixed border-separate border-spacing-0">
                                <colgroup><col className="w-2/5" /><col className="w-1/5" /><col className="w-1/6" /><col className="w-1/4" /><col className="w-28" /></colgroup>
                                <thead className="bg-gray-50 text-left text-sm text-gray-600">
                                    <tr className="border-b">
                                        <th className="px-4 py-3 font-medium">Technologie</th>
                                        <th className="px-4 py-3 font-medium">Kategorie</th>
                                        <th className="px-4 py-3 font-medium">Ring</th>
                                        <th className="px-4 py-3 font-medium">Einordnung</th>
                                        <th className="px-4 py-3 font-medium">Publiziert</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {items.map((t: Technology) => (
                                        <TechRow key={t.id} t={t} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>

            <p className="mt-3 text-xs text-gray-500">
                Tipp: Auf kleineren Screens siehst du Kacheln; ab Desktop wieder die Tabelle.
            </p>
        </main>
    );
}
