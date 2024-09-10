"use client"

import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { useState } from "react";
import {
  UIStreamScreen,
  LanguageCode,
} from "decentrotech-fabric-react-sdk";

import {
  CLIENT_ID,
  CLIENT_SECRET,
  UISTREAM_CALLBACK_URL,
  UISTREAM_FLOW_NAME,
  UISTREAM_REDIRECT_URL,
  UISTREAM_SESSION_API_URL,
} from "@/config";

export default function Home() {
  const [sessionUrl, setSessionUrl] = useState();

  const [sessionRedirectUrl, setSessionCompleteUrl] = useState<string | null>();

  const [loading, setLoading] = useState(false);

  const fetchSessionUrl = async () => {
    setLoading(true);
    setSessionCompleteUrl(null);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("client_id", CLIENT_ID);
    myHeaders.append("client_secret", CLIENT_SECRET);

    const raw = JSON.stringify({
      reference_id: uuidv4(),
      purpose: "To perform KYC of the customer",
      consent: true,
      uistream: UISTREAM_FLOW_NAME,
      redirect_url: UISTREAM_REDIRECT_URL,
      callback_url: UISTREAM_CALLBACK_URL,
    });

    const decentroResponse = await (
      await fetch(UISTREAM_SESSION_API_URL, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
    ).json();

    setSessionUrl(decentroResponse?.data?.url);
    setLoading(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="https://decentro.tech/images/home/decentro-logo.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by configuring your secrets in{" "}
            <code className="bg-black/[.05] px-1 py-0.5 rounded font-semibold">
              src/config.ts
            </code>
            .
          </li>
          <li>Click the generate session button below to start UIStream.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={fetchSessionUrl}
            disabled={loading}
          >
            {loading ? "Loading" : "Generate"} Session
          </button>
          <a
            className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://docs.decentro.tech/docs/kyc-and-onboarding-workflows-uistreams"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        {!sessionRedirectUrl && sessionUrl && (
          <div className="w-full h-full">
            <UIStreamScreen
              sessionUrl={sessionUrl}
              redirectUrl={UISTREAM_REDIRECT_URL}
              callbackUrl={UISTREAM_CALLBACK_URL}
              language={LanguageCode.HINDI}
              additionalData={new Map([["mobile", "9999999999"]])}
              forceAadhaar={false}
              forceMobile={false}
              onSessionComplete={(redirectUrl) =>
                setSessionCompleteUrl(redirectUrl)
              }
            />
          </div>
        )}
        {sessionRedirectUrl && (
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <ul className="mb-2">Session Complete! Redirect URL:</ul>
            <ul>{sessionRedirectUrl}</ul>
          </ol>
        )}
      </main>
    </div>
  );
}
