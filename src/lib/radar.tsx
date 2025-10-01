import { prisma } from "@/lib/prisma";
import { Prisma, Category, Ring, Status, Technology } from "@prisma/client";

// ####################################################
// Root Page
// ####################################################

export async function listPublishedTech() {
    return prisma.technology.findMany({
        where: { status: Status.Published },
        orderBy: [{ publishedAt: "desc" }, { name: "asc" }],
    });
}

// ####################################################
// /admin/new
// ####################################################

export async function createTechDraft(input: {
    name: string;
    category: Category;
    ring: Ring
    techDescription: string;
    classificationNote?: string;
}) {
    return prisma.technology.create({
        data: {
            name: input.name,
            category: input.category,
            ring: input.ring,
            techDescription: input.techDescription,
            classificationNote: input.classificationNote,
            status: Status.Draft,
        },
    });
}

// ####################################################
// /admin/publish
// ####################################################
export async function listDraftTech() {
    return prisma.technology.findMany({
        where: { status: Status.Draft },
        orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    });
}

export async function publishTech(id: string) {
    return prisma.technology.update({
        where: { id },
        data: {
            status: Status.Published,
            publishedAt: new Date(),
        },
    });
}

export async function publishAllDrafts() {
    return prisma.technology.updateMany({
        where: { status: Status.Draft },
        data: {
            status: Status.Published,
            publishedAt: new Date(),
        },
    });
}

// ####################################################
// ####################################################

type TechnologyUpdateData = Parameters<typeof prisma.technology.update>[0]["data"];

export function getTechById(id: string) {
    return prisma.technology.findUnique({ where: { id } });
}

export function listAllTech(query?: string) {
    const queryTrim = (query ?? "").trim();
    const queryLower = queryTrim.toLowerCase();

    if (!queryLower) {
        return prisma.technology.findMany({
            orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { name: "asc" }],
        });
    }

    const caseInsensitive = (searchString: string) => ({
        contains: searchString,
        mode: "insensitive" as const,
    });

    const or: any[] = [
        { name: caseInsensitive(queryTrim) },
        { techDescription: caseInsensitive(queryTrim) },
        { classificationNote: caseInsensitive(queryTrim) },
    ];

    const categoryMatches = Object.values(Category).filter((category) =>
        String(category).toLowerCase().includes(queryLower)
    );
    if (categoryMatches.length) or.push({ category: { in: categoryMatches } });

    const ringMatches = Object.values(Ring).filter((ring) =>
        String(ring).toLowerCase().includes(queryLower)
    );
    if (ringMatches.length) or.push({ ring: { in: ringMatches } });

    return prisma.technology.findMany({
        where: { OR: or },
        orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { name: "asc" }],
    });
}


export async function updateTechSmart(id: string, data: TechnologyUpdateData) {
    const before = await getTechById(id);
    if (!before) throw new Error("Eintrag nicht gefunden.");

    const raw = (data as any).status;
    const targetStatus: Status = raw ? (typeof raw === "string" ? raw : raw.set) : before.status;

    const patch: TechnologyUpdateData = {};
    if (before.status !== targetStatus) {
        (patch as any).publishedAt =
            targetStatus === Status.Published ? before.publishedAt ?? new Date() : null;
    }

    return prisma.technology.update({ where: { id }, data: { ...data, ...patch } });
}

export function isPublishable(t: { ring?: any; classificationNote?: string | null }) {
    return !!t.ring && !!(t.classificationNote && t.classificationNote.trim());
}