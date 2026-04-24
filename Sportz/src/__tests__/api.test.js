import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, server } from "../index.js";
import WebSocket from "ws";

describe("Sportz API Tests", () => {
  let baseUrl = "http://localhost:8000";

  describe("Health Check", () => {
    it("should return health status", async () => {
      const response = await fetch(`${baseUrl}/health`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty("status", "ok");
      expect(data).toHaveProperty("timestamp");
      expect(data).toHaveProperty("uptime");
    });
  });

  describe("Root Endpoint", () => {
    it("should return welcome message", async () => {
      const response = await fetch(baseUrl);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty("message");
      expect(data.message).toContain("Sportz");
    });
  });

  describe("Matches API", () => {
    it("should list matches", async () => {
      const response = await fetch(`${baseUrl}/matches`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should reject invalid limit", async () => {
      const response = await fetch(`${baseUrl}/matches?limit=invalid`);
      expect(response.status).toBe(400);
    });

    it("should create a match", async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

      const response = await fetch(`${baseUrl}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: "football",
          homeTeam: "Team A",
          awayTeam: "Team B",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(data.data).toHaveProperty("id");
    });

    it("should reject invalid match data", async () => {
      const response = await fetch(`${baseUrl}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: "football",
          // Missing homeTeam, awayTeam, times
        }),
      });

      expect(response.status).toBe(400);
    });

    it("should reject when endTime is before startTime", async () => {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() - 1000); // 1 second before

      const response = await fetch(`${baseUrl}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: "football",
          homeTeam: "Team A",
          awayTeam: "Team B",
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      expect(response.status).toBe(400);
    });

    it("should return 404 for non-existent match", async () => {
      const response = await fetch(`${baseUrl}/matches/99999`);
      expect(response.status).toBe(404);
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 errors", async () => {
      const response = await fetch(`${baseUrl}/nonexistent`);
      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data).toHaveProperty("error", "Not Found");
    });
  });

  describe("WebSocket Connection", () => {
    it("should connect to WebSocket", (done) => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.on("open", () => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
        ws.close();
      });

      ws.on("close", () => {
        done();
      });

      ws.on("error", (error) => {
        done(error);
      });
    }, { timeout: 10000 });

    it("should receive welcome message", (done) => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.on("message", (data) => {
        const message = JSON.parse(data.toString());
        expect(message).toHaveProperty("type", "welcome");
        ws.close();
      });

      ws.on("close", () => {
        done();
      });

      ws.on("error", (error) => {
        done(error);
      });
    }, { timeout: 10000 });

    it("should handle multiple concurrent connections", (done) => {
      const connections = 5;
      let connected = 0;

      for (let i = 0; i < connections; i++) {
        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.on("open", () => {
          connected++;
          if (connected === connections) {
            done();
          }
          ws.close();
        });

        ws.on("error", (error) => {
          done(error);
        });
      }
    }, { timeout: 10000 });
  });
});
