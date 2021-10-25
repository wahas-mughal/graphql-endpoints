const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLError,
  GraphQLNonNull,
} = graphql;

// //dummy array
// const books = [
//   { name: "Book 1", genre: "Horror", id: "1", authorId: "1" },
//   { name: "Book 2", genre: "Sci-fi", id: "2", authorId: "2" },
//   { name: "Book 3", genre: "Sci-fi", id: "3", authorId: "3" },
//   { name: "Book 4", genre: "Sci-fi", id: "4", authorId: "2" },
//   { name: "Book 5", genre: "Sci-fi", id: "5", authorId: "2" },
//   { name: "Book 6", genre: "Sci-fi", id: "6", authorId: "3" },
// ];

// //dummy array
// const authors = [
//   { name: "Author 1", age: "30", id: "1" },
//   { name: "Author 2", age: "43", id: "2" },
//   { name: "Author 3", age: "52", id: "3" },
// ];

//object types
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

//root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db / other sourcee
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      },
    },

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({});
      },
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      },
    },
  },
});

// add author in mongoDB
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args) {
        try {
          let author = new Author({
            name: args.name,
            age: args.age,
          });
          const savedAuthor = await author.save();
          return savedAuthor;
        } catch (err) {
          const error = new GraphQLError(err);
          return error;
        }
      },
    },

    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          let book = new Book({
            name: args.name,
            genre: args.genre,
            authorId: args.authorId,
          });

          const savedBook = await book.save();
          return savedBook;
        } catch (err) {
          const error = new GraphQLError(err);
          return error;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
