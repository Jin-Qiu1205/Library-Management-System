// @ts-nocheck

exports.AddBook = async function (req, mongoDB) {
  try {
    const client = await mongoDB.connect("mongodb://localhost:27017/");
    console.log("Adding book:", req.body);
    console.log("Author field in request:", req.body.Author);

    await client
      .db("BooksDB")
      .collection("books")
      .insertOne(req.body);

    await client.close();
    return true;
  } catch (e) {
    console.log("AddBook error:", e);
    return false;
  }
};


exports.GetBooks = async function (mongoDB) {
  try {
    const client = await mongoDB.connect("mongodb://localhost:27017/");
    console.log("Fetching book list...");

    let books = await client
      .db("BooksDB")
      .collection("books")
      .find({})
      .toArray();

    console.log("Retrieved books count:", books.length);
    if (books.length > 0) {
      console.log("First book from DB:", JSON.stringify(books[0], null, 2));
    }

    await client.close();
    return books;
  } catch (e) {
    console.log("GetBooks error:", e);
    return [];
  }
};

