import { listAllTech, updateTechSmart, isPublishable, getTechById } from "@/lib/radar";
import { Category, Ring, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getStr(fd: FormData, key: string) {
    const v = fd.get(key);
    return typeof v === "string" ? v : "";
}

async function updateOneAction(formData: FormData) {
    "use server";

    const id = getStr(formData, "id");
    if (!id) throw new Error("ID fehlt.");

    const name = getStr(formData, "name").trim();
    const category = getStr(formData, "category") as Category;
    const ringRaw = getStr(formData, "ring");
    const techDescription = getStr(formData, "techDescription").trim();
    const classificationNote = getStr(formData, "classificationNote").trim();
    const status = getStr(formData, "status") as Status;

    if (!name || !techDescription || !category || !status) {
        redirect(`/admin/manage?msg=${encodeURIComponent("Bitte Pflichtfelder ausfüllen.")}&type=error`);
    }

    const publishable = isPublishable({
        ring: ringRaw ? (ringRaw as Ring) : null,
        classificationNote: classificationNote || null,
    });

    let nextStatus: Status = status;
    if (status === Status.Published && !publishable) {
        const before = await getTechById(id);
        nextStatus = before?.status ?? Status.Draft;
    }

    await updateTechSmart(id, {
        name,
        category,
        ring: ringRaw ? (ringRaw as Ring) : null,
        techDescription,
        classificationNote: classificationNote || null,
        status: nextStatus,
    });

    revalidatePath("/admin/manage");
    revalidatePath("/");
    revalidatePath("/radar");

    const msg =
        status === Status.Published && !publishable
            ? "Nicht publiziert: Bitte Ring & Einordnung ergänzen."
            : "Gespeichert.";
    const type = status === Status.Published && !publishable ? "warn" : "success";

    redirect(`/admin/manage?msg=${encodeURIComponent(msg)}&type=${type}${""}`);
}

type Tech = Awaited<ReturnType<typeof listAllTech>>[number];

export default async function ManageAllTechPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ q?: string; msg?: string; type?: "success" | "warn" | "error" }>;
}>) {
    const sp = await searchParams;
    const q = sp?.q?.trim() || "";
    const items = await listAllTech(q);

    const categories = Object.values(Category);
    const rings = Object.values(Ring);
    const statuses = Object.values(Status);

    let bannerClass = "border-rose-200 bg-rose-50 text-rose-800";
    if (sp?.type === "success") {
        bannerClass = "border-emerald-200 bg-emerald-50 text-emerald-800";
    } else if (sp?.type === "warn") {
        bannerClass = "border-amber-200 bg-amber-50 text-amber-800";
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-8">
            <header className="mb-4 space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight">Alle Technologien verwalten</h1>

                <form className="flex gap-2" action="/admin/manage" method="get">
                    <input
                        type="search"
                        name="q"
                        defaultValue={q}
                        placeholder="Suchen … (Name, Kategorie, Ring, Beschreibung)"
                        className="w-full rounded-lg border px-3 py-2"
                        aria-label="Einträge durchsuchen"
                    />
                    <button className="rounded-lg border px-3 py-2 hover:bg-gray-50" type="submit">
                        Suchen
                    </button>
                </form>

                {sp?.msg && (
                    <output aria-live="polite" className={`mt-1 block rounded-lg border px-4 py-2 text-sm ${bannerClass}`}>
                        {sp.msg}
                    </output>
                )}
            </header>

            <section className="space-y-4">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <span aria-hidden>📭</span>
                        </div>
                        <p className="font-medium">
                            {q ? "Keine Treffer für deine Suche." : "Keine Einträge vorhanden."}
                        </p>
                    </div>
                ) : (
                    items.map((t: Tech) => {
                        const nameId = `name-${t.id}`;
                        const statusId = `status-${t.id}`;
                        const categoryId = `category-${t.id}`;
                        const ringId = `ring-${t.id}`;
                        const noteId = `classificationNote-${t.id}`;
                        const descId = `techDescription-${t.id}`;

                        return (
                            <form key={t.id} action={updateOneAction} className="rounded-xl border bg-white p-4 shadow-sm">
                                <input type="hidden" name="id" value={t.id} />

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1">
                                        <label className="sr-only" htmlFor={nameId}>
                                            Name
                                        </label>
                                        <input
                                            id={nameId}
                                            name="name"
                                            defaultValue={t.name}
                                            required
                                            className="w-full rounded-lg border px-3 py-2 text-lg font-medium"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {t.category} • {t.ring ?? "kein Ring"}
                                            {t.publishedAt ? ` • publiziert am ${new Date(t.publishedAt).toLocaleDateString()}` : ""}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={statusId}>
                                            Status
                                        </label>
                                        <select id={statusId} name="status" defaultValue={t.status} className="rounded-lg border bg-white px-3 py-2 text-sm">
                                            {statuses.map((s) => (
                                                <option key={s as string} value={s as string}>
                                                    {String(s)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={categoryId}>
                                            Kategorie
                                        </label>
                                        <select id={categoryId} name="category" defaultValue={t.category} className="w-full rounded-lg border bg-white px-3 py-2">
                                            {categories.map((c) => (
                                                <option key={c as string} value={c as string}>
                                                    {String(c)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={ringId}>
                                            Ring
                                        </label>
                                        <select id={ringId} name="ring" defaultValue={t.ring ?? ""} className="w-full rounded-lg border bg-white px-3 py-2">
                                            <option value="">—</option>
                                            {rings.map((r) => (
                                                <option key={r as string} value={r as string}>
                                                    {String(r)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={noteId}>
                                            Einordnung
                                        </label>
                                        <input
                                            id={noteId}
                                            name="classificationNote"
                                            defaultValue={t.classificationNote ?? ""}
                                            className="w-full rounded-lg border px-3 py-2"
                                            placeholder="Kurzbegründung…"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor={descId}>
                                            Beschreibung *
                                        </label>
                                        <textarea
                                            id={descId}
                                            name="techDescription"
                                            required
                                            rows={4}
                                            defaultValue={t.techDescription ?? ""}
                                            className="w-full rounded-lg border px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                        Speichern
                                    </button>
                                </div>
                            </form>
                        );
                    })
                )}
            </section>
        </main>
    );
}
