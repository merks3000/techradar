import { Category, Ring } from "@prisma/client";
import { createTechDraft } from "@/lib/radar";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function createDraftAction(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString().trim() || "";
    const category = (formData.get("category")?.toString() || "Tools") as Category;
    const ring = (formData.get("ring")?.toString() || "Assess") as Ring;
    const techDescription = formData.get("techDescription")?.toString().trim() || "";
    const classificationNote = formData.get("classificationNote")?.toString().trim() || "";

    if (!name) {
        throw new Error("Name ist erforderlich.");
    }
    if (!techDescription) {
        throw new Error("Beschreibung ist erforderlich.");
    }

    await createTechDraft({ name, category, techDescription, ring, classificationNote });

    revalidatePath("/"); // passe an, falls deine Liste auf /radar oder /admin ist
    redirect("/");       // Zielseite anpassen (z. B. "/admin" oder "/radar")
}

export default function Page() {
    const categories = Object.values(Category); // ["Techniques","Platforms","Tools","Languages & Frameworks", ...]
    const rings = Object.values(Ring);

    return (
        <main className="mx-auto max-w-xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-semibold tracking-tight">Neue Technologie als Draft</h1>

            <form action={createDraftAction} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name *
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring"
                        placeholder="z. B. Argo CD"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Kategorie *
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring"
                        defaultValue={Category.Tools}
                    >
                        {categories.map((c) => (
                            <option key={c as string} value={c as string}>
                                {String(c)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="techDescription" className="block text-sm font-medium text-gray-700">
                        Technologie-Beschreibung *
                    </label>
                    <textarea
                        id="techDescription"
                        name="techDescription"
                        required
                        rows={4}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring"
                        placeholder="Kurzbeschreibung der Technologie…"
                    />
                </div>

                <div>
                    <label htmlFor="ring" className="block text-sm font-medium text-gray-700">
                        Ring *
                    </label>
                    <select
                        id="ring"
                        name="ring"
                        className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring"
                        defaultValue={Ring.Assess}
                    >
                        {rings.map((r) => (
                            <option key={r as string} value={r as string}>
                                {String(r)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="classificationNote" className="block text-sm font-medium text-gray-700">
                        Beschreibung der Einordnung *
                    </label>
                    <textarea
                        id="classificationNote"
                        name="classificationNote"
                        required
                        rows={4}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring"
                        placeholder="Kurzbeschreibung der Technologie…"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Draft anlegen
                    </button>
                </div>
            </form>
        </main>
    );
}
