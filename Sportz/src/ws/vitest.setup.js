import { vi } from "vitest";

vi.mock("../arcjet.js", () => ({
  wsArcjet: null,
}));
