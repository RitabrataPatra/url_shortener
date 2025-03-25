import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/dbConnect";

export async function POST(request){
    try {
      
     const client = await dbConnect()
     const body = await request.json();
     const db = client.db("shortlink")
     const db_collection = db.collection("links")
    
     const doc = await db_collection.findOne({shortUrl:body.shortUrl})
     if(doc){
        return NextResponse.json({ error:true,message:"URL ALREADY EXISTS!!" , })
     }
     const result = await db_collection.insertOne({
        url: body.url,
        shortUrl : body.shortUrl
     })

    return NextResponse.json({error :false ,message:"URL GENERATED!!" , })   
    } catch (error) {
        console.log("Error connecting to MongoDB:", error); 
    }
    
}