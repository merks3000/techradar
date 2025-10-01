import { prisma } from "@/lib/prisma";
import { listPublishedTech } from "@/lib/radar";
import { Status } from "@prisma/client";


beforeAll(async () => {
    await prisma.technology.deleteMany();

    await prisma.technology.createMany({
        data: [
            {
                id: "1",
                name: "A",
                category: "Tools",
                ring: "Assess",
                techDescription: "x",
                classificationNote: "n",
                status: Status.Published,
                publishedAt: new Date(),
            },
            {
                id: "2",
                name: "B",
                category: "Tools",
                ring: "Assess",
                techDescription: "y",
                classificationNote: "n",
                status: Status.Draft,
                publishedAt: null,
            },
        ],
        skipDuplicates: true,
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});

it("liefert nur veröffentlichte Technologien", async () => {
    const rows = await listPublishedTech();
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("A");
});
