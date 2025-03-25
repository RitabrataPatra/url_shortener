"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LinkIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const generateShortenedUrl = async () => {
    setLoading(true); // Start loading
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      url: url,
      shortUrl: shortUrl,
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch("/api/shorten", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setGeneratedUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrl}`);
        setUrl("");
        setShortUrl("");
        toast.message(result.message);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to generate short URL");
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };
  

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-center">
        <div>
          <h1 className="text-2xl font-semibold text-center">
            Just type or paste a URL to shorten it!
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 w-1/3">
          <Input
            type="text"
            placeholder="Enter the URL you want to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />

          <Input
            type="text"
            placeholder="Enter the custom short URL (optional)"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
            required
          />

          <Button
            onClick={generateShortenedUrl}
            disabled={loading || !url.trim() || !shortUrl.trim()}
            className="w-full"
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>
                <LinkIcon />
                <p>Shorten</p>
              </>
            )}
          </Button>
        </div>

        {generatedUrl && (
          <div className="flex flex-row items-center gap-4 mt-4">
            <h1 className="font-medium">Shortened URL:</h1>
            <Link
              href={generatedUrl}
              className="border p-2 rounded-lg text-sm"
              target="_blank"
            >
              {generatedUrl}
            </Link>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <p className="text-green-600">Copied!</p> : "Copy"}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
