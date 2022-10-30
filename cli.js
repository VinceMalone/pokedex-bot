const { handler } = require("./dist/pokedex.js");

const [query] = process.argv.slice(2);

const event = {
  queryStringParameters: {
    query,
  },
};

new Promise((resolve) => {
  handler(event, null, (_, { body }) => {
    resolve(body);
  });
}).then((output) => {
  console.log(output);
});
