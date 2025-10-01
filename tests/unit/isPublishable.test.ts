import { isPublishable } from "@/lib/radar";


describe("isPublishable", () => {
    it("true wenn Ring & classificationNote vorhanden", () => {
        expect(isPublishable({ ring: "Adopt", classificationNote: "ok" })).toBe(true);
    });
    it("false wenn Ring fehlt", () => {
        expect(isPublishable({ classificationNote: "ok" })).toBe(false);
    });
});
