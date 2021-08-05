const { articleData } = require('../data/development-data');
const db = require('../connection.js');

// extract any functions you are using to manipulate your data, into this file
exports.formatTopicData = (topicData) => {
  const result = topicData.map((dataObject) => {
    return [dataObject.slug, dataObject.description];
  });
  return result;
};

exports.formatUserData = (userData) => {
  const result = userData.map((object) => {
    return [object.username, object.avatar_url, object.name];
  });
  return result;
};

exports.formatArticleData = (articleData) => {
  const result = articleData.map((object) => {
    return [
      object.title,
      object.body,
      object.votes,
      object.topic,
      object.author,
      object.created_at,
    ];
  });
  return result;
};

exports.renameKeys = (inputArr, keyToChange, newKey) => {
  const newArr = [];
  inputArr.forEach((object) => {
    newArr.push({ ...object });
  });
  newArr.map((element) => {
    element[newKey] = element[keyToChange];
    delete element[keyToChange];
  });
  return newArr;
};

exports.articleRef = (newArticleData, article_id, title) => {
  const articleRef = {};
  newArticleData.forEach((article) => {
    articleRef[article[title]] = article[article_id];
  });
  return articleRef;
};

exports.formatCommentData = (commentData, articleRef) => {
  const arrayData = commentData.map((object) => {
    if (Object.keys(object).length === 0) return [];
    const { body, belongs_to, created_by, votes, created_at } = object;
    return [created_by, articleRef[belongs_to], votes, created_at, body];
  });
  return arrayData;
};

exports.formatPostCommentsData = (postObject) => {
  const newArray = Object.values(postObject);
  return [newArray];
};
