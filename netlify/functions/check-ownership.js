import fetch from "node-fetch";

const XRPL_ENDPOINT = "https://s1.ripple.com:51234";
const ISSUER_ADDRESS = "rYOUR_ISSUER_ADDRESS_HERE";

export async function handler(event) {
  // ✅ XUMM callback (POST)
  if (event.httpMethod === "POST") {
    const payload = JSON.parse(event.body || "{}");
    const wallet = payload?.response?.account;

    if (!wallet) {
      return reply(false);
    }

    const xrplRes = await fetch(XRPL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "account_nfts",
        params: [{ account: wallet }],
      }),
    });

    const data = await xrplRes.json();
    const nfts = data?.result?.account_nfts || [];

    const verified = nfts.some(
      (nft) => nft.Issuer === ISSUER_ADDRESS
    );

    return reply(verified);
  }

  // ✅ Initial call → create XUMM SignIn
  const res = await fetch("https://xumm.app/api/v1/platform/payload", {
    method: "POST",
    headers: {
      "Content ficando Content-Type": "application/json",
      "X-API-Key": process.env.XUMM_API_KEY,
      "X-API-Secret": process.env.XUMM_API_SECRET,
    },
    body: JSON.stringify({
      txjson: { TransactionType: "SignIn" },
    }),
  });

  const data = await res.json();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      redirect: data?.next?.always,
    }),
  };
}

function reply(verified) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verified }),
  };
}
``
