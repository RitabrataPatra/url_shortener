import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db/dbConnect";

let cachedClient = null; // Cache database connection

async function getDb() {
  if (!cachedClient) {
    cachedClient = await dbConnect();
  }
  return cachedClient.db("shortlink");
}

export default async function Page({ params }) {
  const shortUrl = params.shorturl;

  const db = await getDb();
  const db_collection = db.collection("links");

  const doc = await db_collection.findOne({ shortUrl });

  if (doc) {
    console.log(doc.url);
    redirect(doc.url);
    return;
  } else {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    return;
  }
}
