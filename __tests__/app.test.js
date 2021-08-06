const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const { seed } = require('../db/seeds/seed.js');
const app = require('../app.js');
const request = require('supertest');
const { response } = require('../app.js');
const e = require('express');

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
        expect(body.topics).toEqual([
          { slug: 'mitch', description: 'The man, the Mitch, the legend' },
          { slug: 'cats', description: 'Not dogs' },
          { slug: 'paper', description: 'what books are made of' },
        ]);
      });
  });
});

describe('GET - /api/articles/:article_id', () => {
  test('returns an article that matches the parametric endpoint given', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toEqual(1);
      });
  });
  test('should respond with status code 400 if article isnt found', () => {
    return request(app)
      .get('/api/articles/NaN')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
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
  it('handles errors the article id doesnt exist or is wrong', () => {
    const update = { inc_votes: 1 };

    return request(app)
      .patch('/api/articles/NaN')
      .send(update)
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
        expect(body.articles.length).toEqual(12);
      });
  });
  it('should return a list of articles with the expected keys', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).toHaveProperty('article_id');
        expect(body.articles[0]).toHaveProperty('author');
        expect(body.articles[0]).toHaveProperty('votes');
        expect(body.articles[0]).toHaveProperty('comment_count');
        expect(body.articles[0]).toHaveProperty('title');
        expect(body.articles[0]).toHaveProperty('topic');
        expect(body.articles[0]).toHaveProperty('created_at');
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
  it('should default the sorted order to desc', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
  it('should sort by ascending too', () => {
    return request(app)
      .get('/api/articles?sort_by=author&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: false });
      });
  });
  it('should allow the results to be filtered by a specified column', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toEqual(1);
      });
  });
});

describe('GET - /api/articles/:article_id/comments', () => {
  it('should return a list of comments that match the required article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0]).toHaveProperty('comment_id');
        expect(body.comments[0]).toHaveProperty('votes');
        expect(body.comments[0]).toHaveProperty('created_at');
        expect(body.comments[0]).toHaveProperty('author');
        expect(body.comments[0]).toHaveProperty('body');
      });
  });
  it('should respond with a 404 if the id doesnt exist', () => {
    return request(app)
      .get('/api/articles/123456/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
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
});

describe('POST - /api/articles/:article_id/comments', () => {
  it('should return a comment once posted', () => {
    const postComment = { username: 'Ant', body: 'comment text' };
    return request(app)
      .post('/api/articles/1/comments')
      .send(postComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.author).toEqual(postComment.username);
        expect(body.comment.body).toEqual(postComment.body);
        expect(body.comment).toHaveProperty('article_id');
        expect(body.comment).toHaveProperty('comment_id');
        expect(body.comment).toHaveProperty('created_at');
        expect(body.comment).toHaveProperty('votes');
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
    return request(app).delete('/api/comments/38').expect(204);
  });
  it(`should respond with 400 Bad Request if comment_id is bad`, () => {
    return request(app).delete('/api/comments/notANumber').expect(400);
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
        expect(body.user).toHaveProperty('username');
        expect(body.user).toHaveProperty('avatar_url');
        expect(body.user).toHaveProperty('name');
      });
  });
  it.only('should respond with 404 if user doesnt exist', () => {
    return request(app).get('/api/users/anthony').expect(404);
  });
});
