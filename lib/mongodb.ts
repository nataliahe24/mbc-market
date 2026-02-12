import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = "mbc_marketplace";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  if (cached) return cached.db;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  cached = { client, db };

  return db;
}
