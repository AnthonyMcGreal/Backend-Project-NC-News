const { articleData } = require('../data/development-data');
const db = require('../connection.js');

// extract any functions you are using to manipulate your data, into this file
exports.formatTopicData = (topicData) => {
  const formattedData = topicData.map((dataObject) => {
    return [dataObject.slug, dataObject.description];
  });
  return formattedData;
};

exports.formatUserData = (userData) => {
  const formattedData = userData.map((userObject) => {
    return [userObject.username, userObject.avatar_url, userObject.name];
  });
  return formattedData;
};

exports.formatArticleData = (articleData) => {
  const formattedData = articleData.map((article) => {
    return [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      article.created_at,
    ];
  });
  return formattedData;
};

exports.renameKeys = (inputArr, keyToChange, newKey) => {
  const formattedData = [];
  inputArr.forEach((object) => {
    formattedData.push({ ...object });
  });
  formattedData.map((element) => {
    element[newKey] = element[keyToChange];
    delete element[keyToChange];
  });
  return formattedData;
};

exports.articleRef = (newArticleData, article_id, title) => {
  const articleRef = {};
  newArticleData.forEach((article) => {
    articleRef[article[title]] = article[article_id];
  });
  return articleRef;
};

exports.formatCommentData = (commentData, articleRef) => {
  const arrayData = commentData.map((comment) => {
    if (Object.keys(comment).length === 0) return [];
    const { body, belongs_to, created_by, votes, created_at } = comment;
    return [created_by, articleRef[belongs_to], votes, created_at, body];
  });
  return arrayData;
};

exports.formatPostCommentsData = (postObject, article_id) => {
  const formattedData = Object.values(postObject);
  formattedData.push(article_id);
  return [formattedData];
};
