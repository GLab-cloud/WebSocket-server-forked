import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { matches } from "./db/schema.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const uclMatches2024_25 = [
  { homeTeam: "Bayern München", awayTeam: "GNK Dinamo", homeScore: 9, awayScore: 2, date: "2024-09-17" },
  { homeTeam: "AC Milan", awayTeam: "Liverpool", homeScore: 1, awayScore: 3, date: "2024-09-17" },
  { homeTeam: "Juventus", awayTeam: "PSV Eindhoven", homeScore: 3, awayScore: 1, date: "2024-09-17" },
  { homeTeam: "Young Boys", awayTeam: "Aston Villa", homeScore: 0, awayScore: 3, date: "2024-09-17" },
  { homeTeam: "Real Madrid", awayTeam: "Stuttgart", homeScore: 3, awayScore: 1, date: "2024-09-17" },
  { homeTeam: "Sporting CP", awayTeam: "Lille", homeScore: 2, awayScore: 0, date: "2024-09-17" },
  { homeTeam: "Manchester City", awayTeam: "Inter Milan", homeScore: 0, awayScore: 0, date: "2024-09-18" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Girona", homeScore: 1, awayScore: 0, date: "2024-09-18" },
  { homeTeam: "Celtic", awayTeam: "Slovan Bratislava", homeScore: 5, awayScore: 1, date: "2024-09-18" },
  { homeTeam: "Club Brugge", awayTeam: "Borussia Dortmund", homeScore: 0, awayScore: 3, date: "2024-09-18" },
  { homeTeam: "Bologna", awayTeam: "Shakhtar Donetsk", homeScore: 0, awayScore: 0, date: "2024-09-18" },
  { homeTeam: "Sparta Praha", awayTeam: "Salzburg", homeScore: 3, awayScore: 0, date: "2024-09-18" },
  { homeTeam: "Feyenoord", awayTeam: "Bayer Leverkusen", homeScore: 0, awayScore: 4, date: "2024-09-19" },
  { homeTeam: "Crvena Zvezda", awayTeam: "Benfica", homeScore: 1, awayScore: 2, date: "2024-09-19" },
  { homeTeam: "Monaco", awayTeam: "Barcelona", homeScore: 2, awayScore: 1, date: "2024-09-19" },
  { homeTeam: "Atalanta", awayTeam: "Arsenal", homeScore: 0, awayScore: 0, date: "2024-09-19" },
  { homeTeam: "Atlético de Madrid", awayTeam: "Leipzig", homeScore: 2, awayScore: 1, date: "2024-09-19" },
  { homeTeam: "Brest", awayTeam: "Sturm Graz", homeScore: 2, awayScore: 1, date: "2024-09-19" },
  { homeTeam: "Arsenal", awayTeam: "Paris Saint-Germain", homeScore: 2, awayScore: 0, date: "2024-10-01" },
  { homeTeam: "Bayer Leverkusen", awayTeam: "AC Milan", homeScore: 1, awayScore: 0, date: "2024-10-01" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Celtic", homeScore: 7, awayScore: 1, date: "2024-10-01" },
  { homeTeam: "Barcelona", awayTeam: "Young Boys", homeScore: 5, awayScore: 0, date: "2024-10-01" },
  { homeTeam: "Inter Milan", awayTeam: "Crvena Zvezda", homeScore: 4, awayScore: 0, date: "2024-10-01" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Sporting CP", homeScore: 1, awayScore: 1, date: "2024-10-01" },
  { homeTeam: "Salzburg", awayTeam: "Brest", homeScore: 0, awayScore: 4, date: "2024-10-01" },
  { homeTeam: "Stuttgart", awayTeam: "Sparta Praha", homeScore: 1, awayScore: 1, date: "2024-10-01" },
  { homeTeam: "Manchester City", awayTeam: "Sparta Praha", homeScore: 5, awayScore: 0, date: "2024-10-02" },
  { homeTeam: "Leipzig", awayTeam: "Liverpool", homeScore: 0, awayScore: 1, date: "2024-10-02" },
  { homeTeam: "Liverpool", awayTeam: "Bologna", homeScore: 2, awayScore: 0, date: "2024-10-02" },
  { homeTeam: "Lille", awayTeam: "Real Madrid", homeScore: 1, awayScore: 0, date: "2024-10-02" },
  { homeTeam: "Leipzig", awayTeam: "Juventus", homeScore: 2, awayScore: 3, date: "2024-10-02" },
  { homeTeam: "Sturm Graz", awayTeam: "Club Brugge", homeScore: 0, awayScore: 1, date: "2024-10-02" },
  { homeTeam: "Benfica", awayTeam: "Atlético de Madrid", homeScore: 4, awayScore: 0, date: "2024-10-02" },
  { homeTeam: "Shakhtar Donetsk", awayTeam: "Atalanta", homeScore: 0, awayScore: 3, date: "2024-10-02" },
  { homeTeam: "Girona", awayTeam: "Feyenoord", homeScore: 2, awayScore: 3, date: "2024-10-02" },
  { homeTeam: "Aston Villa", awayTeam: "Bayern München", homeScore: 1, awayScore: 0, date: "2024-10-02" },
  { homeTeam: "GNK Dinamo", awayTeam: "Monaco", homeScore: 2, awayScore: 2, date: "2024-10-02" },
  { homeTeam: "Barcelona", awayTeam: "Bayern München", homeScore: 4, awayScore: 1, date: "2024-10-23" },
  { homeTeam: "Manchester City", awayTeam: "Sparta Praha", homeScore: 5, awayScore: 0, date: "2024-10-23" },
  { homeTeam: "AC Milan", awayTeam: "Club Brugge", homeScore: 3, awayScore: 1, date: "2024-10-22" },
  { homeTeam: "Monaco", awayTeam: "Crvena Zvezda", homeScore: 5, awayScore: 1, date: "2024-10-22" },
  { homeTeam: "Arsenal", awayTeam: "Shakhtar Donetsk", homeScore: 1, awayScore: 0, date: "2024-10-22" },
  { homeTeam: "Aston Villa", awayTeam: "Bologna", homeScore: 2, awayScore: 0, date: "2024-10-22" },
  { homeTeam: "Girona", awayTeam: "Slovan Bratislava", homeScore: 2, awayScore: 0, date: "2024-10-22" },
  { homeTeam: "Juventus", awayTeam: "Stuttgart", homeScore: 0, awayScore: 1, date: "2024-10-22" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "PSV Eindhoven", homeScore: 1, awayScore: 1, date: "2024-10-22" },
  { homeTeam: "Real Madrid", awayTeam: "Borussia Dortmund", homeScore: 5, awayScore: 2, date: "2024-10-22" },
  { homeTeam: "Sturm Graz", awayTeam: "Sporting CP", homeScore: 0, awayScore: 2, date: "2024-10-22" },
  { homeTeam: "Atalanta", awayTeam: "Celtic", homeScore: 0, awayScore: 0, date: "2024-10-23" },
  { homeTeam: "Brest", awayTeam: "Bayer Leverkusen", homeScore: 1, awayScore: 1, date: "2024-10-23" },
  { homeTeam: "Atlético de Madrid", awayTeam: "Lille", homeScore: 1, awayScore: 3, date: "2024-10-23" },
  { homeTeam: "Young Boys", awayTeam: "Inter Milan", homeScore: 0, awayScore: 1, date: "2024-10-23" },
  { homeTeam: "Salzburg", awayTeam: "GNK Dinamo", homeScore: 0, awayScore: 2, date: "2024-10-23" },
  { homeTeam: "Benfica", awayTeam: "Feyenoord", homeScore: 1, awayScore: 3, date: "2024-10-23" },
  { homeTeam: "Liverpool", awayTeam: "Bayer Leverkusen", homeScore: 4, awayScore: 0, date: "2024-11-05" },
  { homeTeam: "Real Madrid", awayTeam: "AC Milan", homeScore: 1, awayScore: 3, date: "2024-11-05" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Sturm Graz", homeScore: 1, awayScore: 0, date: "2024-11-05" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Girona", homeScore: 4, awayScore: 0, date: "2024-11-05" },
  { homeTeam: "Celtic", awayTeam: "Leipzig", homeScore: 3, awayScore: 1, date: "2024-11-05" },
  { homeTeam: "Slovan Bratislava", awayTeam: "GNK Dinamo", homeScore: 1, awayScore: 4, date: "2024-11-05" },
  { homeTeam: "Bologna", awayTeam: "Monaco", homeScore: 0, awayScore: 1, date: "2024-11-05" },
  { homeTeam: "Lille", awayTeam: "Juventus", homeScore: 1, awayScore: 1, date: "2024-11-05" },
  { homeTeam: "Sporting CP", awayTeam: "Manchester City", homeScore: 4, awayScore: 1, date: "2024-11-05" },
  { homeTeam: "Bayern München", awayTeam: "Benfica", homeScore: 1, awayScore: 0, date: "2024-11-06" },
  { homeTeam: "Inter Milan", awayTeam: "Arsenal", homeScore: 1, awayScore: 0, date: "2024-11-06" },
  { homeTeam: "Club Brugge", awayTeam: "Aston Villa", homeScore: 1, awayScore: 0, date: "2024-11-06" },
  { homeTeam: "Shakhtar Donetsk", awayTeam: "Young Boys", homeScore: 2, awayScore: 1, date: "2024-11-06" },
  { homeTeam: "Sparta Praha", awayTeam: "Brest", homeScore: 1, awayScore: 2, date: "2024-11-06" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Atlético de Madrid", homeScore: 1, awayScore: 2, date: "2024-11-06" },
  { homeTeam: "Feyenoord", awayTeam: "Salzburg", homeScore: 1, awayScore: 3, date: "2024-11-06" },
  { homeTeam: "Crvena Zvezda", awayTeam: "Barcelona", homeScore: 2, awayScore: 5, date: "2024-11-06" },
  { homeTeam: "Stuttgart", awayTeam: "Atalanta", homeScore: 0, awayScore: 2, date: "2024-11-06" },
  { homeTeam: "Manchester City", awayTeam: "Feyenoord", homeScore: 3, awayScore: 3, date: "2024-11-26" },
  { homeTeam: "Bayern München", awayTeam: "Paris Saint-Germain", homeScore: 1, awayScore: 0, date: "2024-11-26" },
  { homeTeam: "Inter Milan", awayTeam: "Leipzig", homeScore: 1, awayScore: 0, date: "2024-11-26" },
  { homeTeam: "Sporting CP", awayTeam: "Arsenal", homeScore: 1, awayScore: 5, date: "2024-11-26" },
  { homeTeam: "Barcelona", awayTeam: "Brest", homeScore: 3, awayScore: 0, date: "2024-11-26" },
  { homeTeam: "Sparta Praha", awayTeam: "Atlético de Madrid", homeScore: 0, awayScore: 6, date: "2024-11-26" },
  { homeTeam: "Young Boys", awayTeam: "Atalanta", homeScore: 1, awayScore: 6, date: "2024-11-26" },
  { homeTeam: "Bayer Leverkusen", awayTeam: "Salzburg", homeScore: 5, awayScore: 0, date: "2024-11-26" },
  { homeTeam: "Liverpool", awayTeam: "Real Madrid", homeScore: 2, awayScore: 0, date: "2024-11-27" },
  { homeTeam: "Girona", awayTeam: "Liverpool", homeScore: 0, awayScore: 1, date: "2024-12-10" },
  { homeTeam: "Atalanta", awayTeam: "Real Madrid", homeScore: 2, awayScore: 3, date: "2024-12-10" },
  { homeTeam: "Bayer Leverkusen", awayTeam: "Inter Milan", homeScore: 1, awayScore: 0, date: "2024-12-10" },
  { homeTeam: "Shakhtar Donetsk", awayTeam: "Bayern München", homeScore: 1, awayScore: 5, date: "2024-12-10" },
  { homeTeam: "Leipzig", awayTeam: "Aston Villa", homeScore: 2, awayScore: 3, date: "2024-12-10" },
  { homeTeam: "Brest", awayTeam: "PSV Eindhoven", homeScore: 1, awayScore: 0, date: "2024-12-10" },
  { homeTeam: "Salzburg", awayTeam: "Paris Saint-Germain", homeScore: 0, awayScore: 3, date: "2024-12-10" },
  { homeTeam: "Club Brugge", awayTeam: "Sporting CP", homeScore: 2, awayScore: 1, date: "2024-12-10" },
  { homeTeam: "GNK Dinamo", awayTeam: "Celtic", homeScore: 0, awayScore: 0, date: "2024-12-10" },
  { homeTeam: "AC Milan", awayTeam: "Crvena Zvezda", homeScore: 2, awayScore: 1, date: "2024-12-11" },
  { homeTeam: "Arsenal", awayTeam: "Monaco", homeScore: 3, awayScore: 0, date: "2024-12-11" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Barcelona", homeScore: 2, awayScore: 3, date: "2024-12-11" },
  { homeTeam: "Juventus", awayTeam: "Manchester City", homeScore: 2, awayScore: 0, date: "2024-12-11" },
  { homeTeam: "Feyenoord", awayTeam: "Sparta Praha", homeScore: 4, awayScore: 2, date: "2024-12-11" },
  { homeTeam: "Atlético de Madrid", awayTeam: "Slovan Bratislava", homeScore: 3, awayScore: 1, date: "2024-12-11" },
  { homeTeam: "Lille", awayTeam: "Sturm Graz", homeScore: 3, awayScore: 2, date: "2024-12-11" },
  { homeTeam: "Stuttgart", awayTeam: "Young Boys", homeScore: 5, awayScore: 1, date: "2024-12-11" },
  { homeTeam: "Benfica", awayTeam: "Bologna", homeScore: 0, awayScore: 0, date: "2024-12-11" },
  { homeTeam: "Monaco", awayTeam: "Aston Villa", homeScore: 1, awayScore: 0, date: "2025-01-21" },
  { homeTeam: "Atalanta", awayTeam: "Sturm Graz", homeScore: 5, awayScore: 0, date: "2025-01-21" },
  { homeTeam: "Atlético de Madrid", awayTeam: "Bayer Leverkusen", homeScore: 2, awayScore: 1, date: "2025-01-21" },
  { homeTeam: "Bologna", awayTeam: "Borussia Dortmund", homeScore: 2, awayScore: 1, date: "2025-01-21" },
  { homeTeam: "Liverpool", awayTeam: "Lille", homeScore: 2, awayScore: 1, date: "2025-01-21" },
  { homeTeam: "Benfica", awayTeam: "Barcelona", homeScore: 4, awayScore: 5, date: "2025-01-21" },
  { homeTeam: "Crvena Zvezda", awayTeam: "PSV Eindhoven", homeScore: 2, awayScore: 3, date: "2025-01-21" },
  { homeTeam: "Club Brugge", awayTeam: "Juventus", homeScore: 0, awayScore: 0, date: "2025-01-21" },
  { homeTeam: "Slovan Bratislava", awayTeam: "Stuttgart", homeScore: 1, awayScore: 3, date: "2025-01-21" },
  { homeTeam: "Shakhtar Donetsk", awayTeam: "Brest", homeScore: 2, awayScore: 0, date: "2025-01-22" },
  { homeTeam: "Leipzig", awayTeam: "Sporting CP", homeScore: 2, awayScore: 1, date: "2025-01-22" },
  { homeTeam: "AC Milan", awayTeam: "Girona", homeScore: 1, awayScore: 0, date: "2025-01-22" },
  { homeTeam: "Sparta Praha", awayTeam: "Inter Milan", homeScore: 0, awayScore: 1, date: "2025-01-22" },
  { homeTeam: "Arsenal", awayTeam: "GNK Dinamo", homeScore: 3, awayScore: 0, date: "2025-01-22" },
  { homeTeam: "Celtic", awayTeam: "Young Boys", homeScore: 1, awayScore: 0, date: "2025-01-22" },
  { homeTeam: "Feyenoord", awayTeam: "Bayern München", homeScore: 3, awayScore: 0, date: "2025-01-22" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Manchester City", homeScore: 4, awayScore: 2, date: "2025-01-22" },
  { homeTeam: "Real Madrid", awayTeam: "Salzburg", homeScore: 5, awayScore: 1, date: "2025-01-22" },
  { homeTeam: "Aston Villa", awayTeam: "Celtic", homeScore: 4, awayScore: 2, date: "2025-01-29" },
  { homeTeam: "Bayer Leverkusen", awayTeam: "Sparta Praha", homeScore: 2, awayScore: 0, date: "2025-01-29" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Shakhtar Donetsk", homeScore: 3, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Barcelona", awayTeam: "Atalanta", homeScore: 2, awayScore: 2, date: "2025-01-29" },
  { homeTeam: "Bayern München", awayTeam: "Slovan Bratislava", homeScore: 3, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Inter Milan", awayTeam: "Monaco", homeScore: 3, awayScore: 0, date: "2025-01-29" },
  { homeTeam: "Lille", awayTeam: "Feyenoord", homeScore: 6, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Manchester City", awayTeam: "Club Brugge", homeScore: 3, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Liverpool", homeScore: 3, awayScore: 2, date: "2025-01-29" },
  { homeTeam: "Girona", awayTeam: "Arsenal", homeScore: 1, awayScore: 2, date: "2025-01-29" },
  { homeTeam: "GNK Dinamo", awayTeam: "AC Milan", homeScore: 2, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Juventus", awayTeam: "Benfica", homeScore: 0, awayScore: 2, date: "2025-01-29" },
  { homeTeam: "Young Boys", awayTeam: "Crvena Zvezda", homeScore: 0, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Real Madrid", awayTeam: "Brest", homeScore: 0, awayScore: 3, date: "2025-01-29" },
  { homeTeam: "Sturm Graz", awayTeam: "Leipzig", homeScore: 1, awayScore: 0, date: "2025-01-29" },
  { homeTeam: "Sporting CP", awayTeam: "Bologna", homeScore: 1, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Stuttgart", homeScore: 4, awayScore: 1, date: "2025-01-29" },
  { homeTeam: "Salzburg", awayTeam: "Atlético de Madrid", homeScore: 1, awayScore: 4, date: "2025-01-29" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Juventus", homeScore: 3, awayScore: 1, date: "2025-02-11" },
  { homeTeam: "Manchester City", awayTeam: "Real Madrid", homeScore: 2, awayScore: 3, date: "2025-02-11" },
  { homeTeam: "Brest", awayTeam: "Paris Saint-Germain", homeScore: 0, awayScore: 3, date: "2025-02-11" },
  { homeTeam: "Club Brugge", awayTeam: "Atalanta", homeScore: 2, awayScore: 1, date: "2025-02-11" },
  { homeTeam: "Celtic", awayTeam: "Bayern München", homeScore: 1, awayScore: 2, date: "2025-02-11" },
  { homeTeam: "Feyenoord", awayTeam: "AC Milan", homeScore: 1, awayScore: 0, date: "2025-02-11" },
  { homeTeam: "Monaco", awayTeam: "Benfica", homeScore: 0, awayScore: 1, date: "2025-02-11" },
  { homeTeam: "Sporting CP", awayTeam: "Borussia Dortmund", homeScore: 0, awayScore: 3, date: "2025-02-11" },
  { homeTeam: "AC Milan", awayTeam: "Feyenoord", homeScore: 1, awayScore: 1, date: "2025-02-18" },
  { homeTeam: "Atalanta", awayTeam: "Club Brugge", homeScore: 1, awayScore: 3, date: "2025-02-18" },
  { homeTeam: "Bayern München", awayTeam: "Celtic", homeScore: 1, awayScore: 1, date: "2025-02-18" },
  { homeTeam: "Benfica", awayTeam: "Monaco", homeScore: 3, awayScore: 3, date: "2025-02-18" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Brest", homeScore: 7, awayScore: 0, date: "2025-02-19" },
  { homeTeam: "Real Madrid", awayTeam: "Manchester City", homeScore: 3, awayScore: 1, date: "2025-02-18" },
  { homeTeam: "Juventus", awayTeam: "PSV Eindhoven", homeScore: 3, awayScore: 1, date: "2025-02-19" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Sporting CP", homeScore: 0, awayScore: 0, date: "2025-02-19" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Juventus", homeScore: 3, awayScore: 1, date: "2025-02-19" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Juventus", homeScore: 3, awayScore: 1, date: "2025-02-19" },
  { homeTeam: "Liverpool", awayTeam: "Paris Saint-Germain", homeScore: 0, awayScore: 1, date: "2025-03-04" },
  { homeTeam: "Real Madrid", awayTeam: "Atlético de Madrid", homeScore: 2, awayScore: 1, date: "2025-03-04" },
  { homeTeam: "Club Brugge", awayTeam: "Aston Villa", homeScore: 1, awayScore: 3, date: "2025-03-04" },
  { homeTeam: "PSV Eindhoven", awayTeam: "Arsenal", homeScore: 1, awayScore: 7, date: "2025-03-04" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Lille", homeScore: 1, awayScore: 1, date: "2025-03-04" },
  { homeTeam: "Bayern München", awayTeam: "Bayer Leverkusen", homeScore: 3, awayScore: 0, date: "2025-03-05" },
  { homeTeam: "Inter Milan", awayTeam: "Feyenoord", homeScore: 2, awayScore: 1, date: "2025-03-05" },
  { homeTeam: "Barcelona", awayTeam: "Benfica", homeScore: 3, awayScore: 1, date: "2025-03-05" },
  { homeTeam: "Feyenoord", awayTeam: "Inter Milan", homeScore: 0, awayScore: 2, date: "2025-03-12" },
  { homeTeam: "Barcelona", awayTeam: "Benfica", homeScore: 3, awayScore: 1, date: "2025-03-11" },
  { homeTeam: "Lille", awayTeam: "Borussia Dortmund", homeScore: 1, awayScore: 2, date: "2025-03-12" },
  { homeTeam: "Aston Villa", awayTeam: "Club Brugge", homeScore: 3, awayScore: 0, date: "2025-03-12" },
  { homeTeam: "Arsenal", awayTeam: "PSV Eindhoven", homeScore: 2, awayScore: 2, date: "2025-03-12" },
  { homeTeam: "Liverpool", awayTeam: "Paris Saint-Germain", homeScore: 0, awayScore: 1, date: "2025-03-12" },
  { homeTeam: "Bayer Leverkusen", awayTeam: "Bayern München", homeScore: 0, awayScore: 2, date: "2025-03-12" },
  { homeTeam: "Atlético de Madrid", awayTeam: "Real Madrid", homeScore: 1, awayScore: 0, date: "2025-03-12" },
  { homeTeam: "Bayern München", awayTeam: "Inter Milan", homeScore: 1, awayScore: 2, date: "2025-04-08" },
  { homeTeam: "Arsenal", awayTeam: "Real Madrid", homeScore: 3, awayScore: 0, date: "2025-04-08" },
  { homeTeam: "Barcelona", awayTeam: "Borussia Dortmund", homeScore: 4, awayScore: 0, date: "2025-04-09" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Aston Villa", homeScore: 3, awayScore: 1, date: "2025-04-09" },
  { homeTeam: "Inter Milan", awayTeam: "Bayern München", homeScore: 2, awayScore: 2, date: "2025-04-16" },
  { homeTeam: "Real Madrid", awayTeam: "Arsenal", homeScore: 1, awayScore: 2, date: "2025-04-16" },
  { homeTeam: "Borussia Dortmund", awayTeam: "Barcelona", homeScore: 3, awayScore: 1, date: "2025-04-15" },
  { homeTeam: "Aston Villa", awayTeam: "Paris Saint-Germain", homeScore: 3, awayScore: 2, date: "2025-04-15" },
  { homeTeam: "Arsenal", awayTeam: "Paris Saint-Germain", homeScore: 0, awayScore: 1, date: "2025-04-29" },
  { homeTeam: "Barcelona", awayTeam: "Inter Milan", homeScore: 3, awayScore: 3, date: "2025-04-30" },
  { homeTeam: "Arsenal", awayTeam: "Paris Saint-Germain", homeScore: 2, awayScore: 1, date: "2025-05-07" },
  { homeTeam: "Inter Milan", awayTeam: "Barcelona", homeScore: 4, awayScore: 3, date: "2025-05-06" },
  { homeTeam: "Paris Saint-Germain", awayTeam: "Inter Milan", homeScore: 5, awayScore: 0, date: "2025-05-31" },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function parseDate(dateStr) {
  return new Date(`${dateStr}T20:00:00Z`);
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

async function seedMatches() {
  console.log("Seeding UCL 2024-25 matches...");
  
  const shuffled = shuffleArray(uclMatches2024_25);
  const selectedMatches = shuffled.slice(0, 100);
  
  let inserted = 0;
  for (const m of selectedMatches) {
    const startTime = parseDate(m.date);
    const endTime = addHours(startTime, 2);
    
    await db.insert(matches).values({
      sport: "football",
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      startTime: startTime,
      endTime: endTime,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      status: "finished",
    });
    inserted++;
  }
  
  console.log(`Inserted ${inserted} matches into the database.`);
  
  await pool.end();
}

seedMatches().catch(console.error);