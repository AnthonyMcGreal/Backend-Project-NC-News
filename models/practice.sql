\c nc_news_test

INSERT INTO users
(username, name)
VALUES
('ant', 'ant')
RETURNING *;

INSERT INTO comments
 (author, body)
 VALUES
 ('ant', 'this really working?') 
 RETURNING *;
