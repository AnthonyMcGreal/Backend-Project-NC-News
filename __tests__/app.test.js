const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET - /api/topics", () => {
  test("returns an array of topic objects with all properties", async () => {
    await request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(body.topics).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend" },
          { slug: "cats", description: "Not dogs" },
          { slug: "paper", description: "what books are made of" },
        ]);
      });
  });
});

describe("GET - /api/articles/:article_id", () => {
  test("returns an article that matches the parametric endpoint given", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toEqual(1);
      });
  });
  test("should respond with status code 400 if article isnt found", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe("PATCH - /api/articles/:article_id", () => {
  it("should update the article object and return the updated article", () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(1);
        expect(body.article.article_id).toEqual(2);
      });
  });
  it("handles errors the article id doesnt exist or is wrong", () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/NaN")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe.only("GET - /api/articles", () => {
  it("should return a list of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(12);
      });
  });
  it("should return a list of articles with the expected keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).toHaveProperty("article_id");
        expect(body.articles[0]).toHaveProperty("author");
        expect(body.articles[0]).toHaveProperty("votes");
        expect(body.articles[0]).toHaveProperty("comment_count");
        expect(body.articles[0]).toHaveProperty("title");
        expect(body.articles[0]).toHaveProperty("topic");
        expect(body.articles[0]).toHaveProperty("created_at");
      });
  });
  it("sorts the articles by date as the default sort_by", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("sorts the articles by the request sort_by method", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  it("should default the sorted order to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        //console.log(body.articles);
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  it("should sort by ascending too", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: false });
      });
  });
  it("should allow the results to be filtered by a specified column", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(1);
      });
  });
  // it('should return a 400 error if query isnt acceptable', () => {
  //   return request(app)
  //   .get('/api/articles?')
  // })
});
