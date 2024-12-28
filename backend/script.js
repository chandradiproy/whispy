import { MongoClient } from "mongodb";

const uri = "mongodb+srv://diproy2002:RHjp5Sl5HMA04iax@cluster0.x8qk1.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster0";

async function clearCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collections
    const database = client.db("chat_db");
    const userCollection = database.collection("users");
    const messageCollection = database.collection("messages");

    // Clear all documents from the collections
    const userDeleteResult = await userCollection.deleteMany({});
    const messageDeleteResult = await messageCollection.deleteMany({});

    console.log(`Cleared ${userDeleteResult.deletedCount} records from 'user' collection`);
    console.log(`Cleared ${messageDeleteResult.deletedCount} records from 'message' collection`);
  } catch (err) {
    console.error("Error clearing collections:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

clearCollections();
