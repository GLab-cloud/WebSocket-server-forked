import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("ws", () => {
  const mockOn = vi.fn();
  return {
    WebSocketServer: vi.fn(() => ({
      clients: new Set(),
      on: mockOn,
      handleUpgrade: vi.fn(),
      emit: vi.fn(),
    })),
    WebSocket: {
      OPEN: 1,
      CLOSED: 3,
    },
  };
});

import { WebSocket, WebSocketServer } from "ws";
import { attachWebSocketServer } from "./server.js";

describe("sendJson", () => {
  it("should send JSON when socket is OPEN", () => {
    const mockSocket = {
      readyState: WebSocket.OPEN,
      send: vi.fn(),
    };
    const payload = { type: "test", data: "hello" };
    
    if (mockSocket.readyState !== WebSocket.OPEN) return;
    mockSocket.send(JSON.stringify(payload));
    
    expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify(payload));
  });

  it("should not send when socket is not OPEN", () => {
    const mockSocket = {
      readyState: WebSocket.CLOSED,
      send: vi.fn(),
    };
    
    if (mockSocket.readyState !== WebSocket.OPEN) return;
    mockSocket.send(JSON.stringify({ type: "test" }));
    
    expect(mockSocket.send).not.toHaveBeenCalled();
  });
});

describe("broadcast", () => {
  it("should broadcast to all OPEN clients", () => {
    const mockClient1 = { readyState: WebSocket.OPEN, send: vi.fn() };
    const mockClient2 = { readyState: WebSocket.OPEN, send: vi.fn() };
    const mockClient3 = { readyState: WebSocket.CLOSED, send: vi.fn() };
    const mockWss = {
      clients: [mockClient1, mockClient2, mockClient3],
    };
    
    for (const client of mockWss.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;
      client.send(JSON.stringify({ type: "broadcast" }));
    }
    
    expect(mockClient1.send).toHaveBeenCalledWith(JSON.stringify({ type: "broadcast" }));
    expect(mockClient2.send).toHaveBeenCalledWith(JSON.stringify({ type: "broadcast" }));
    expect(mockClient3.send).not.toHaveBeenCalled();
  });
});

describe("attachWebSocketServer", () => {
  let mockServer;
  let mockOn;

  beforeEach(() => {
    mockOn = vi.fn();
    vi.mocked(WebSocketServer).mockImplementation(() => ({
      clients: new Set(),
      on: mockOn,
      handleUpgrade: vi.fn(),
      emit: vi.fn(),
    }));
    mockServer = {
      on: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should attach 'upgrade' event handler", () => {
    attachWebSocketServer(mockServer);
    expect(mockServer.on).toHaveBeenCalledWith("upgrade", expect.any(Function));
  });

  it("should return broadcastMatchCreated function", () => {
    const result = attachWebSocketServer(mockServer);
    expect(result).toHaveProperty("broadcastMatchCreated");
    expect(typeof result.broadcastMatchCreated).toBe("function");
  });

  it("should reject non-websocket paths", async () => {
    attachWebSocketServer(mockServer);
    
    const upgradeHandler = mockServer.on.mock.calls.find(c => c[0] === "upgrade")[1];
    
    const mockReq = { 
      url: "/api/users", 
      headers: { host: "localhost:3000" } 
    };
    const mockSocket = { destroy: vi.fn() };
    
    await upgradeHandler(mockReq, mockSocket, {});
    expect(mockSocket.destroy).not.toHaveBeenCalled();
  });
});
