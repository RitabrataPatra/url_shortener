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
    if (!url.trim() || !shortUrl.trim()) {
      toast.warning("Please enter a valid URL and short URL!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/shorten", {
        url,
        shortUrl,
      });

      console.log("API Response:", response.data);

      if (response.data.error) {
        toast.warning(response.data.message + " Try something else.");
      } else {
        toast.success("URL Generated Successfully");

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        setGeneratedUrl(`${baseUrl}/${shortUrl}`);
        setUrl("");
        setShortUrl("");
      }
    } catch (error) {
      console.error("Error posting data to DB:", error);
      toast.error("Error posting data to DB. Check console for details.");
    } finally {
      setLoading(false);
    }
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
            {loading ? <Loader2Icon className="animate-spin" /> : <><LinkIcon /><p>Shorten</p></>}
          </Button>
        </div>

        {generatedUrl && (
          <div className="flex flex-row items-center gap-4 mt-4">
            <h1 className="font-medium">Shortened URL:</h1>
            <Link href={generatedUrl} className="border p-2 rounded-lg text-sm" target="_blank">
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
