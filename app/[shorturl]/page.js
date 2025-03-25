import { redirect } from "next/navigation";

import { dbConnect } from "@/lib/db/dbConnect";
export default async function Page({ params }) {
  const shortUrl = (await params).shorturl;

  const client = await dbConnect();
  const db = client.db("shortlink");
  const db_collection = db.collection("links");

  const doc = await db_collection.findOne({ shortUrl: shortUrl });
  if (doc) {
    console.log(doc.url);
    redirect(doc.url);
  } else {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  }
}
