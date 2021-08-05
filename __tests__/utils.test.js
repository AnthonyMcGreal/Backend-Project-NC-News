const {
  formatTopicData,
  formatUserData,
  formatArticleData,
  renameKeys,
  articleRef,
  formatCommentData,
  formatPostCommentsData,
} = require('../db/utils/data-manipulation');

describe('testing formaTopicData', () => {
  it('shouldnt mutate the original data', () => {
    const input = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ];
    const input2 = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ];

    formatTopicData(input);

    expect(input).toEqual(input2);
  });
  it('should return an array of nested arrays from an object', () => {
    const input = [
      {
        description: 'The man, the Mitch, the legend',
        slug: 'mitch',
      },
      {
        description: 'Not dogs',
        slug: 'cats',
      },
    ];

    const output = [
      ['mitch', 'The man, the Mitch, the legend'],
      ['cats', 'Not dogs'],
    ];

    expect(formatTopicData(input)).toEqual(output);
  });
});

describe('testing formatUserData', () => {
  it('shoudnt mutate the input data', () => {
    const input = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ];

    const input2 = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ];

    formatUserData(input);

    expect(input).toEqual(input2);
  });
  it('returns an array or nested arrays matching the corect order', () => {
    const input = [
      {
        username: 'butter_bridge',
        name: 'jonny',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
      {
        username: 'icellusedkars',
        name: 'sam',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
      },
    ];

    const output = [
      [
        'butter_bridge',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        'jonny',
      ],
      [
        'icellusedkars',
        'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
        'sam',
      ],
    ];

    expect(formatUserData(input)).toEqual(output);
  });
});

describe('testing formatArticleData', () => {
  it('doesnt mutate the data', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ];

    const input2 = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ];

    formatArticleData(input);

    expect(input).toEqual(input2);
  });
  it('returns a nested array of data from article data', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        created_at: new Date(1602828180000),
        votes: 0,
      },
    ];

    const output = [
      [
        'Living in the shadow of a great man',
        'I find this existence challenging',
        100,
        'mitch',
        'butter_bridge',
        new Date(1594329060000),
      ],
      [
        'Sony Vaio; or, The Laptop',
        'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
        0,
        'mitch',
        'icellusedkars',
        new Date(1602828180000),
      ],
    ];

    expect(formatArticleData(input)).toEqual(output);
  });
});

describe('testing renameKey function', () => {
  it('doesnt mutate the input', () => {
    const inputArr = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const inputArr2 = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];

    renameKeys(inputArr, 'body', 'test');
    expect(inputArr).toEqual(inputArr2);
  });
  it('changes the required key to a new key', () => {
    const input = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const output = [
      {
        legs: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];

    expect(renameKeys(input, 'body', 'legs')).toEqual(output);
  });
});

describe('testing articleRef function', () => {
  it('doesnt mutate the original input', () => {
    const input1 = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const input2 = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];

    articleRef(input1, 'body', 'belongs_to');
    expect(input1).toEqual(input2);
  });
  it('produces an object of key/value pairs from the objects provided', () => {
    const input = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
      {
        body: 'I hate streaming noses',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: new Date(1604437200000),
      },
    ];
    const output = {
      ' I carry a log — yes. Is it funny to you? It is not to me.':
        'Living in the shadow of a great man',
      'I hate streaming noses': 'Living in the shadow of a great man',
    };
    expect(articleRef(input, 'belongs_to', 'body')).toEqual(output);
  });
});

describe('testing formatCommentData', () => {
  it('should return an array with nested arrays when passed an array with nested objects', () => {
    const input = [{}, {}];
    const output = [[], []];
    const testArticleRef = { number: 1, colour: 'red' };
    expect(formatCommentData(input, testArticleRef)).toEqual(output);
  });
  it('should return nested arrays from objects with key/value pairs', () => {
    const input = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const output = [
      [
        'icellusedkars',
        1,
        -100,
        new Date(1582459260000),
        ' I carry a log — yes. Is it funny to you? It is not to me.',
      ],
    ];
    const testArticleRef = {
      'Living in the shadow of a great man': 1,
      colour: 'red',
    };
    expect(formatCommentData(input, testArticleRef)).toEqual(output);
  });
  it('should swap out key names with if required', () => {
    const input = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const testArticleRef = {
      'Living in the shadow of a great man': 1,
      colour: 'red',
    };

    const output = [
      [
        'icellusedkars',
        1,
        -100,
        new Date(1582459260000),
        ' I carry a log — yes. Is it funny to you? It is not to me.',
      ],
    ];

    expect(formatCommentData(input, testArticleRef)).toEqual(output);
  });
  it('doesnt mutate the original entry', () => {
    const input1 = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];

    const input2 = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: new Date(1582459260000),
      },
    ];
    const testArticleRef = {
      'Living in the shadow of a great man': 1,
      colour: 'red',
    };

    formatCommentData(input1, testArticleRef);

    expect(input1).toEqual(input2);
  });
});

describe('testing formatPostCommentsData', () => {
  it('should return an array of the values in an object', () => {
    const input = { name: 'Ant' };
    const output = [['Ant']];
    expect(formatPostCommentsData(input)).toEqual(output);
  });
  it('should work on larger objects', () => {
    const input = { name: 'Ant', age: 33, petName: 'Freya' };
    const output = [['Ant', 33, 'Freya']];
    expect(formatPostCommentsData(input)).toEqual(output);
  });
  it('doesnt mutate the original input', () => {
    const input = { name: 'Ant', age: 33, petName: 'Freya' };
    const input2 = { name: 'Ant', age: 33, petName: 'Freya' };
    formatPostCommentsData(input);
    expect(input).toEqual(input2);
  });
});
