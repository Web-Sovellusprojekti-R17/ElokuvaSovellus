import request from "supertest"; // Tuodaan Supertest-kirjasto. Sitä käytetään HTTP-pyyntöjen tekemiseen Express-sovellukseen ilman varsinaista palvelimen käynnistämistä (ns. end-to-end-testaus).
import dotenv from "dotenv"; 
dotenv.config(); 
import app from "./app.js"; // Tuodaan Express-sovellusinstanssi ('app'), jota testataan.
import pool from "../database.js"; // Tuodaan tietokantayhteyspooli (pool) tietokantayhteyden sulkemiseksi testien jälkeen.

// --- Testien siivous ---
// afterAll on Jest/Mocha-testauskehyksen funktio, joka suoritetaan sen jälkeen, kun KAIKKI testit tässä tiedostossa ovat valmiit.
afterAll(async () => {
  // Suljetaan tietokantayhteyspooli, jotta Node.js-prosessi voi sammua siististi testien päätyttyä.
  await pool.query("TRUNCATE users RESTART IDENTITY CASCADE");
  await pool.end();
});

test("1) POST /lähetä arvostelu", async () => {
  const res = await request(app).post("/review")
  .send({ movie_ID: 1, user_ID: 1, review: "ok", rating: 2}); 
  expect(res.status).toBe(200);
});

test("2) GET /hae arvostelut", async () => {
  const res = await request(app).get("/review")
  expect(res.status).toBe(200);
  expect(res.body[0]).toHaveProperty("movie_ID", 1);
});

test("3) GET /hae arvostelu", async () => {
    const movie_id = 1;
  const res = await request(app).get(`/review/${movie_id}`)
  expect(res.status).toBe(200);
  expect(res.body[0]).toHaveProperty("movie_ID", 1);
});

test("4) DELETE /poista arvostelu", async () => {
    const movie_id = 1;
  const res = await request(app).delete(`/review/${movie_id}`)
  expect(res.status).toBe(200);
});