\c nc_news_test

SELECT comment_id, votes, created_at,author,body, article_id
FROM comments
WHERE article_id = 3


