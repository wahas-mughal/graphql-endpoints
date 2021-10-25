const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb://Admin:Admin%23132@clusterfornodebackend-shard-00-00.silgx.mongodb.net:27017,clusterfornodebackend-shard-00-01.silgx.mongodb.net:27017,clusterfornodebackend-shard-00-02.silgx.mongodb.net:27017/graphql-db?ssl=true&replicaSet=atlas-g7jqpd-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = 4000 || process.env.PORT;

app.listen(PORT, () => {
  console.log("listening to server at PORT 4000");
});
