const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const app = require('../app.js');
const request = require('supertest');
const { response } = require('../app.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET - /api/topics', () => {
  test('returns an array of topic objects with all properties', async () => {
    await request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      });
  });
});

describe('GET - /api/articles/:article_id', () => {
  test('returns an article that matches the parametric endpoint given', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty('article_id');
        expect(body.article.article_id).toEqual(1);
        expect(body.article).toHaveProperty('title');
        expect(body.article).toHaveProperty('body');
        expect(body.article).toHaveProperty('votes');
        expect(body.article).toHaveProperty('topic');
        expect(body.article).toHaveProperty('author');
        expect(body.article).toHaveProperty('created_at');
      });
  });
  test('should respond with status code 400 if input isnt valid', () => {
    return request(app)
      .get('/api/articles/NaN')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  test('should respond with code 404 if article doesnt exist', () => {
    return request(app)
      .get('/api/articles/9999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
});

describe('PATCH - /api/articles/:article_id', () => {
  it('should update the article object and return the updated article', () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch('/api/articles/1')
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toEqual(101);
        expect(body.article.article_id).toEqual(1);
      });
  });
  it('handles errors where the article id doesnt exist or is wrong', () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch('/api/articles/NaN')
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('responds with 404 when input doesnt exist', () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch('/api/articles/9999')
      .send(update)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
  it('should respond with a 400 if user input is bad', () => {
    const input = { inc_votes: 'NaN' };
    return request(app)
      .patch('/api/articles/1')
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
});

describe('GET - /api/articles', () => {
  it('should return a list of articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(10);
      });
  });
  it('should return a list of articles with the expected keys', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('comment_count');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('topic');
          expect(article).toHaveProperty('created_at');
        });
      });
  });
  it('sorts the articles by date as the default sort_by', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
      });
  });
  it('sorts the articles by the request sort_by method', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
  it('should return 400 when input sort_by is bad', () => {
    return request(app)
      .get('/api/articles?sort_by=bananas')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('should default the sorted order to desc', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
  it('should sort by ascending', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: false });
      });
  });
  it('should sort by descending', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=desc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
  it('should return 400 when input order is bad', () => {
    return request(app)
      .get('/api/articles?order=bananas')
      .expect(400)
      .then(({ body }) => [expect(body.msg).toEqual('Bad Request')]);
  });
  it('should allow the results to be filtered by a specified column', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(1);
      });
  });
  it('should return 404 when filter topic is bad', () => {
    return request(app)
      .get('/api/articles?topic=bananas')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
  it('should return 200 if topic is found but has 0 associated articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(0);
      });
  });
  it('should accept a Limit query', () => {
    return request(app)
      .get('/api/articles?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(5);
      });
  });
  it('should default to 10 when not passed a limit', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(10);
      });
  });
  it('responds with a 400 if givin an invalid limit query', () => {
    return request(app)
      .get('/api/articles?limit=notANumber')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('takes a page query to filter results', () => {
    return request(app)
      .get('/api/articles?page=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(2);
      });
  });
  it('responds with 400 if given an invalid page query', () => {
    return request(app)
      .get('/api/articles?page=notANumber')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
});

describe('GET - /api/articles/:article_id/comments', () => {
  it('should return a list of comments that match the required article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('body');
        });
      });
  });
  it('should respond with a 404 if the id doesnt exist', () => {
    return request(app)
      .get('/api/articles/123456/comments')
      .expect(404)
      .then((body) => {
        expect(body.text).toEqual('Not Found');
      });
  });
  it('should respond with 400 if given an invalid', () => {
    return request(app)
      .get('/api/articles/notAnId/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('should respond 200 i article exists but has no articles', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  it('should accept a Limit query', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(5);
      });
  });
  it('should default to 10 when not passed a limit', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(10);
      });
  });
  it('responds with a 400 if givin an invalid limit query', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=notANumber')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('takes a page query to filter results', () => {
    return request(app)
      .get('/api/articles/1/comments?page=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toEqual(3);
      });
  });
  it('responds with 400 if given an invalid page query', () => {
    return request(app)
      .get('/api/articles/1/comments?page=notANumber')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
});

describe('POST - /api/articles/:article_id/comments', () => {
  it('should return a comment once posted', () => {
    const postComment = { username: 'icellusedkars', body: 'comment text' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(postComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.author).toEqual(postComment.username);
        expect(body.comment.body).toEqual(postComment.body);
        expect(body.comment).toHaveProperty('article_id');
      });
  });
  it('returns a 400 Bad Request if body doesnt meet spec required', () => {
    const inputObj = { body: 'should break it' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(inputObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('returns a 400 Bad Request if passed a bad article_id', () => {
    const inputObj = { username: 'icellusedkars', body: 'comment text' };
    return request(app)
      .post('/api/articles/NotAnId/comments')
      .send(inputObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('should return a 404 if passed an article_id that doesnt exist', () => {
    const inputObj = { username: 'icellusedkars', body: 'comment text' };
    return request(app)
      .post('/api/articles/123456/comments')
      .send(inputObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
  it('should return a 404 if passed a user that doesnt exist', () => {
    const inputObj = { username: 'Ant', body: 'comment text' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(inputObj)
      .expect(404)
      .then(({ body }) => [expect(body.msg).toEqual('Not Found')]);
  });
});

describe('GET - /api', () => {
  it('returns a description of available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.endPoints).toEqual('object');
        expect(body.endPoints).toHaveProperty('GET /api');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('should delete a comment based on its comment_id value', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });
  it(`should respond with 400 Bad Request if comment_id is bad`, () => {
    return request(app).delete('/api/comments/notANumber').expect(400);
  });
  it('should respond with a 404 if comment doesnt exist', () => {
    return request(app).delete('/api/comments/256457623').expect(404);
  });
});

describe('GET /api/users', () => {
  it('responds with an array of objects each having a username property', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user.hasOwnProperty('username')).toEqual(true);
        });
      });
  });
  it('responds with 404 if path doesnt exist', () => {
    return request(app).get('/api/users1234').expect(404);
  });
});

describe('GET /api/users/:username', () => {
  it('should respond with a user object', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user[0]).toHaveProperty('username');
        expect(body.user[0]).toHaveProperty('avatar_url');
        expect(body.user[0]).toHaveProperty('name');
      });
  });
  it('should respond with 404 if user doesnt exist', () => {
    return request(app).get('/api/users/anthony').expect(404);
  });
});

describe('PATCH - /api/comments/:comment_id', () => {
  it('returns a comment after successfully updating its votes  ', () => {
    const inputObj = { inc_votes: 5 };

    return request(app)
      .patch('/api/comments/1')
      .send(inputObj)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment[0]).toHaveProperty('body');
        expect(body.comment[0].body).toEqual(expect.any(String));
      });
  });
  it('returns a 404 if comment_id doesnt exist', () => {
    const inputObj = { inc_votes: 5 };

    return request(app)
      .patch('/api/comments/123456')
      .send(inputObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
  it('returns a 400 if input is bad', () => {
    const inputObj = { inc_votes: 'notANumber' };

    return request(app)
      .patch('/api/comments/1')
      .send(inputObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
  it('returns a 400 if the input key is bad', () => {
    const inputObj = { inotAVote: 5 };

    return request(app)
      .patch('/api/comments/1')
      .send(inputObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
});
