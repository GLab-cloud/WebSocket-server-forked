# WebSocket Server Code Review & Optimization Guide

**Repository:** GLab-cloud/WebSocket-server-forked  
**Project:** Sportz - Real-time Sports Match WebSocket Server  
**Date:** 2026-04-24  
**Status:** Created with CodeSandbox

---

## Executive Summary

This is a real-time WebSocket server built with Express, WebSocket (ws), PostgreSQL, and Arcjet for rate limiting. The project tracks sports matches with live score updates via WebSocket broadcasts. Overall structure is solid, but there are several optimization opportunities and best practices to implement.

**Priority:** 🔴 High | 🟡 Medium | 🟢 Low

---

## 🔴 Critical Issues

### 1. **Invalid Zod Schema - Line 16 in matches.js**
```javascript
const isoDateString = z.iso.datetime() // Incorrect!
```
**Problem:** `z.iso` doesn't exist. Should be `z.string().datetime()`.

**Impact:** Schema validation will fail at runtime.

**Fix:**
```javascript
const isoDateString = z.string().datetime({
  message: "Invalid ISO 8601 datetime string"
});
```

---

### 2. **Missing Error Return in Routes - matches.js:16-21**
```javascript
const parsed = listMatchesQuerySchema.safeParse(req.query);
if (!parsed.success) {
  res.status(400).json({...}); // Missing return!
}
```

**Problem:** Code continues executing even after error response is sent, causing potential double-response errors.

**Fix:** Add `return` statements:
```javascript
if (!parsed.success) {
  return res.status(400).json({
    error: "Invalid query",
    details: parsed.error.issues,
  });
}
```

### 3. **Typo in WebSocket Handler - server.js:50**
```javascript
socket.write("HTTP/1.1 429 To Many Requests\r\n\r\n");
```

**Problem:** "To Many" should be "Too Many".

**Fix:**
```javascript
socket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n");
```

### 4. **Typo in WebSocket Handler - server.js:59**
```javascript
socket.write("HTTP/1.1 500 Internal Server Eror\r\n\r\n");
```

**Problem:** "Eror" should be "Error".

**Fix:**
```javascript
socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
```

---

## 🟡 Medium Priority Issues

### 5. **Unsafe HOST Environment Variable Parsing - index.js:7**
```javascript
const HOST = Number(process.env.HOST) || "0.0.0.0";
```

**Problem:** 
- `Number("0.0.0.0")` = `NaN`, not a string
- Type mismatch: HOST will be either a number or string
- Logic is broken; condition always evaluates to NaN

**Fix:**
```javascript
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 8000;
```

---

### 6. **Potential Type Issues with PORT Calculation - index.js:23-25**
```javascript
const baseUrl = HOST === "0.0.0.0" 
  ? `http://localhost:${PORT}` 
  : `http://localhost:${HOST}:${PORT}`;
```

**Problem:** After the Number() conversion, this logic is confusing and HOST could be NaN.

**Fix:** Separate HOST and PORT parsing clearly:
```javascript
const HOST = process.env.HOST || "0.0.0.0";
const PORT = parseInt(process.env.PORT, 10) || 8000;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === "0.0.0.0" 
    ? `http://localhost:${PORT}` 
    : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseUrl}`);
});
```

---

### 7. **Arcjet Dependency Injection Antipattern - index.js:18-20**
```javascript
app.locals.broadcastMatchCreated = broadcastMatchCreated;
// consider use DI or event emitter pattern for larger app
```

**Problem:** Using `app.locals` is not scalable and violates separation of concerns.

**Recommendations:**
- Use **Node.js EventEmitter** pattern:
```javascript
import EventEmitter from "events";
export const appEvents = new EventEmitter();

// In matches.js
appEvents.emit("match:created", event);

// In ws/server.js
appEvents.on("match:created", (match) => {
  broadcast(wss, { type: "match_created", data: match });
});
```

---

### 8. **Missing startTime in Schema - schema.js:22-32**
```javascript
export const matches = pgTable("matches", {
  // ...
  endTime: timestamp("end_time"),
  // Missing startTime field!
```

**Problem:** Schema doesn't include `startTime`, but route inserts it. Database constraint missing.

**Fix:**
```javascript
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: text("sport").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  startTime: timestamp("start_time").notNull(),  // ← Add this
  endTime: timestamp("end_time").notNull(),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

### 9. **Race Condition in WebSocket Connection - server.js:64-72**
```javascript
wss.handleUpgrade(req, socket, head, (ws) => {
  wss.emit("connection", ws, req);
  ws.isAlive = true;  // ← Flag set but no listener for "pong"
  ws.on("pong", () => {
    ws.isAlive = true;
  });
});
```

**Problem:** `ws.isAlive` could be checked before "pong" handler is attached.

**Fix:**
```javascript
wss.handleUpgrade(req, socket, head, (ws) => {
  ws.isAlive = true;
  
  ws.on("pong", () => {
    ws.isAlive = true;
  });
  
  ws.on("error", console.error);
  
  wss.emit("connection", ws, req);
  sendJson(ws, { type: "welcome" });
});
```

---

## 🟢 Optimization Recommendations

### 10. **Add Request/Response Logging**
```javascript
// Add in index.js
import morgan from "morgan";
app.use(morgan("combined"));
```

### 11. **Connection Pool Configuration**
```javascript
// db.js - Add pool configuration
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 12. **Graceful Shutdown**
```javascript
// Add to index.js
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("HTTP server closed");
    pool.end(() => {
      console.log("Database pool closed");
      process.exit(0);
    });
  });
});
```

### 13. **Add Health Check Endpoint**
```javascript
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
```

### 14. **Validate Database Connection on Startup**
```javascript
// db.js
try {
  const result = await db.execute(sql`SELECT NOW()`);
  console.log("Database connection verified:", result);
} catch (e) {
  console.error("Database connection failed:", e);
  process.exit(1);
}
```

### 15. **Use Constants for Magic Numbers**
```javascript
// Add constants file: src/constants.js
export const CONSTANTS = {
  MAX_PAYLOAD: 1024 * 1024,           // 1MB
  MAX_MATCH_LIMIT: 100,
  DEFAULT_LIMIT: 50,
  WS_HEARTBEAT_INTERVAL: 30000,       // 30s
  WS_RATE_LIMIT_INTERVAL: "2s",
  WS_RATE_LIMIT_MAX: 5,
  HTTP_RATE_LIMIT_INTERVAL: "10s",
  HTTP_RATE_LIMIT_MAX: 50,
};
```

### 16. **Add Input Validation Middleware**
```javascript
// middleware/validation.js
export const validateJson = (req, res, next) => {
  if (req.headers["content-length"] && 
      parseInt(req.headers["content-length"]) > 1024 * 1024) {
    return res.status(413).json({ error: "Payload too large" });
  }
  next();
};
```

### 17. **Implement Structured Logging**
```javascript
// utils/logger.js
export const logger = {
  info: (msg, data) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`, data),
  error: (msg, err) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, err),
  warn: (msg, data) => console.warn(`[WARN] ${new Date().toISOString()} ${msg}`, data),
};
```

### 18. **Add Environment Variable Validation**
```javascript
// config/env.js
const requiredEnvVars = ["DATABASE_URL", "ARCJET_KEY"];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### 19. **Cache Compiled Regex/URL Patterns**
```javascript
// In server.js upgrade handler
const WS_PATH = "/ws";

server.on("upgrade", async (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname !== WS_PATH) {
    socket.destroy();
    return;
  }
  // ... rest of logic
});
```

### 20. **Add Database Query Optimization**
```javascript
// Consider adding indexes to schema
export const matches = pgTable("matches", {
  // ... columns
}, (table) => ({
  statusIdx: index("idx_matches_status").on(table.status),
  createdAtIdx: index("idx_matches_created_at").on(table.createdAt),
  sportIdx: index("idx_matches_sport").on(table.sport),
}));
```

---

## Additional Recommendations

### Testing
- Add unit tests with Vitest (already configured in package.json)
- Add integration tests for WebSocket connections
- Add load testing with Artillery or K6

### DevOps
- Add Docker support with Dockerfile
- Add `.dockerignore` file
- Create GitHub Actions CI/CD pipeline
- Add health checks for production deployment

### Documentation
- Add JSDoc comments for functions
- Create API documentation (Swagger/OpenAPI)
- Add troubleshooting guide for WebSocket connection issues

### Security Enhancements
- Add request body size limits
- Add CORS configuration for production
- Add helmet.js for security headers
- Validate all user inputs strictly
- Use environment variables for sensitive data

---

## Summary Table

| Issue | Severity | Type | File | Line(s) |
|-------|----------|------|------|---------|
| Invalid Zod schema | 🔴 Critical | Bug | validation/matches.js | 16 |
| Missing error returns | 🔴 Critical | Bug | routes/matches.js | 16-21, 42-47 |
| Typo: "To Many" | 🔴 Critical | Bug | ws/server.js | 50 |
| Typo: "Eror" | 🔴 Critical | Bug | ws/server.js | 59 |
| HOST type mismatch | 🟡 Medium | Bug | index.js | 7, 23-25 |
| Antipattern DI | 🟡 Medium | Design | index.js | 19-20 |
| Missing startTime field | 🟡 Medium | Schema | db/schema.js | 22 |
| Race condition WS | 🟡 Medium | Bug | ws/server.js | 64-72 |
| No logging | 🟢 Low | Enhancement | - | - |
| No pool config | 🟢 Low | Optimization | db/db.js | - |
| No graceful shutdown | 🟢 Low | Enhancement | index.js | - |
| No health check | 🟢 Low | Feature | index.js | - |

---

## Next Steps

1. **Fix critical bugs immediately** (Issues #1-4, #8)
2. **Refactor HOST/PORT parsing** (Issue #5-6)
3. **Implement EventEmitter pattern** (Issue #7)
4. **Fix WebSocket race condition** (Issue #9)
5. **Add production-ready features** (Issues #10-20)
6. **Create comprehensive tests**
7. **Set up CI/CD pipeline**

---

**Generated:** 2026-04-24  
**Reviewed by:** GitHub Copilot
