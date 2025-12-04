import request from "supertest"; // Tuodaan Supertest-kirjasto. Sitä käytetään HTTP-pyyntöjen tekemiseen Express-sovellukseen ilman varsinaista palvelimen käynnistämistä (ns. end-to-end-testaus).
import dotenv from "dotenv"; 
dotenv.config(); 
import app from "./app.js"; // Tuodaan Express-sovellusinstanssi ('app'), jota testataan.
import pool from "../database.js"; // Tuodaan tietokantayhteyspooli (pool) tietokantayhteyden sulkemiseksi testien jälkeen.

const testUsername = "testuser";
const testPassword = "testpassword";
const testUserID = 1;
let refreshToken = "";
let accessToken = "";

// --- Testien siivous ---
// afterAll on Jest/Mocha-testauskehyksen funktio, joka suoritetaan sen jälkeen, kun KAIKKI testit tässä tiedostossa ovat valmiit.
afterAll(async () => {
  // Suljetaan tietokantayhteyspooli, jotta Node.js-prosessi voi sammua siististi testien päätyttyä.
  await pool.query("TRUNCATE users RESTART IDENTITY CASCADE");
  await pool.end();
});

// --- Testitapaukset ---
test("1) POST /register puutteellisella syötöllä", async () => {
  const res = await request(app).post("/user/register")
  .send({ name: testUsername }); 

  expect(res.status).toBe(400);
});

test("2) POST /register", async () => {
  const res = await request(app).post("/user/register")
  .send({ name: testUsername, password: testPassword }); 

  expect(res.status).toBe(201);
});


test("3) POST /login puutteellisella syötöllä", async () => {
  const res = await request(app)
    .post("/user/login") 
    .send({ name: testUsername });
  
  expect(res.status).toBe(400);
});


test("4) POST /login väärällä salasanalla", async () => {
  const res = await request(app)
    .post("/user/login") 
    .send({ name: testUsername, password:"wrongpassword" });
  
  expect(res.status).toBe(401);
});

test("5) POST /login", async () => {
  const res = await request(app)
    .post("/user/login") 
    .send({ name: testUsername, password: testPassword});
  
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("accessToken");

  accessToken = res.body.accessToken;
  console.log("Access Token:", accessToken);
  const cookies = res.headers["set-cookie"];
  refreshToken = cookies
    .find((c) => c.startsWith("refreshToken"))
    ?.split(";")[0]
    .split("=")[1];

  expect(refreshToken).toBeDefined();
});

test("6) PUT  /date/:id käyttäjän deaktivointi ilman accessTokenia", async () => {
  const res = await request(app)
    .put(`/user/date/${testUserID}`)
    .send({password: testPassword});

  expect(res.status).toBe(401);
});

test("7) PUT  /date/:id käyttäjän deaktivointi ilman salasanaa", async () => {
  const res = await request(app)
    .put(`/user/date/${testUserID}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(res.status).toBe(400);
});

test("8) PUT  /date/:id käyttäjän deaktivointi", async () => {
  const res = await request(app)
    .put(`/user/date/${testUserID}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({password: testPassword});

  expect(res.status).toBe(200);
});

test("9) POST /logout tokenilla", async () => {
  const res = await request(app)
    .post("/user/logout")
    .set("Cookie", `refreshToken=${refreshToken}`);

  expect(res.status).toBe(200);
});

