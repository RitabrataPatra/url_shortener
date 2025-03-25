"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkIcon , Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"


import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const text = "Dummy ";

  const generateShortenedUrl =async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/shorten", {
        url: url,
        shortUrl: shortUrl,
      })
      console.log(response)
      if(response.data.error == true){
        toast.warning(response.data.message + "Try something else.")
      }
      else{
        toast.success("URL Generated Successfully")
        setGeneratedUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrl}`);
        setUrl("");
        setShortUrl("");
      }
      
    } catch (error) {
      console.log("Error posting data to DB :", error);
      toast.error("Error posting data to DB")
    }
    finally {
      setLoading(false);
    }
      
  };

  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (error) {
      console.log("Failed to copy", error);
    }
  };
  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-center">
        <div>
          <h1 className="text-2xl">
            Just Type or paste a URL to shorten it and you are done!
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 w-1/3 ">
          <Input
            type="email"
            placeholder="Enter the URL you want to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Input
            type="email"
            placeholder="Enter the short URL you want"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            required
          />

          <Button onClick={generateShortenedUrl} disabled={loading}>
            {loading ? (<Loader2Icon/>) : (<><LinkIcon/><p>Shorten</p></>)}
          </Button>
        </div>

        {/* render conditionally */}
        {generatedUrl && (
          <div className="flex flex-row items-center gap-4">
            <h1>Shortened URL : </h1>
            <Link href={generatedUrl} className="border p-2 rounded-lg text-sm" target="_blank">{generatedUrl}</Link>
            <Button variant={"outline"} onClick={handleCopy}>
              {copied ? <p className="text-green-600">Copied !</p> : "Copy"}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
