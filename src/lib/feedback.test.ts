import { describe, expect, it } from "vitest";
import { createFeedbackLimiter, feedbackInput, FEEDBACK_TYPES } from "./feedback";

describe("feedbackInput", () => {
  it("accetta un messaggio valido", () => {
    const r = feedbackInput.safeParse({ type: "idea", message: "Mi piacerebbe una modalità sfida a squadre.", wantReply: false });
    expect(r.success).toBe(true);
  });
  it("rifiuta messaggi troppo corti o troppo lunghi", () => {
    expect(feedbackInput.safeParse({ type: "idea", message: "ciao", wantReply: false }).success).toBe(false);
    expect(feedbackInput.safeParse({ type: "idea", message: "x".repeat(2001), wantReply: false }).success).toBe(false);
  });
  it("rifiuta un tipo inventato", () => {
    expect(feedbackInput.safeParse({ type: "hack", message: "un messaggio abbastanza lungo", wantReply: false }).success).toBe(false);
  });
  it("conosce i tre tipi", () => {
    expect(FEEDBACK_TYPES.map((t) => t.id)).toEqual(["idea", "problema", "complimento"]);
  });
});

describe("createFeedbackLimiter", () => {
  it("lascia passare tre messaggi in dieci minuti e blocca il quarto", () => {
    const l = createFeedbackLimiter();
    const t = 1_000_000;
    expect(l("u1", t)).toBe(false);
    expect(l("u1", t + 1)).toBe(false);
    expect(l("u1", t + 2)).toBe(false);
    expect(l("u1", t + 3)).toBe(true);
    expect(l("u2", t + 3)).toBe(false);
  });
  it("dopo la finestra si può riscrivere", () => {
    const l = createFeedbackLimiter();
    for (let i = 0; i < 3; i++) l("u1", i);
    expect(l("u1", 11 * 60_000)).toBe(false);
  });
});
