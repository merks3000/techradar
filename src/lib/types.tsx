export type Category = "Techniques" | "Platforms" | "Tools" | "Languages_Frameworks";
export type Ring = "Assess" | "Trial" | "Adopt" | "Hold";

export type Technology = {
    id: string;
    name: string;
    category: Category;
    ring: Ring | null; // auch null, weil optional bei Drafts
    techDescription: string; // auch null, weil optional bei Drafts
    classificationNote: string | null; // auch null, weil optional bei Drafts
    publishedAt: Date | null; // auch null, weil nicht vorhanden bei Drafts
};
