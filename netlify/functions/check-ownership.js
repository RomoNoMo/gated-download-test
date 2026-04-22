const XRPL_ENDPOINT = "https://s1.ripple.com:51234";

// 🔴 REPLACE WITH YOUR REAL ISSUER ADDRESS
const ISSUER_ADDRESS = "rDGYJop7bqtzXwsammJnENho7u2aBv9Ni9";

exports.handler = async function (event) {
  try {
    // 🔁 STEP A: XUMM callback (POST)
    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      const wallet = payload?.response?.account;

      if (!wallet) {
        return json({ verified: false });
      }

      const xrplRes = await fetch(Xm);
      const xrpl = await fetch(XRPL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "account_nfts",
          params: [{ account: wallet }],
        }),
      });

      const data = await xrpl.json();
      const nfts = data?.result?.account_nfts || [];

      const verified = nfts.some(nft => nft.Issuer === ISSUER_ADDRESS);

      return json({ verified });
    }

    // 🔁 STEP B: Initial call → Create XUMM SignIn
    const res = await fetch("https://xumm.app/api/v1/platform/payload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.XUMM_API_KEY,
        "X-API-Secret": process.env.XUMM_API_SECRET,
      },
      body: JSON.stringify({
        txjson: { TransactionType: "SignIn" },
      }),
    });

    if (!res.ok) {
      throw new Error("XUMM API error");
    }

    const data = await res.json();

    return json({
      redirect: data?.next?.always,
    });

  } catch (err) {
    console.error("Function error:", err);
    return json({ error: "server_error" });
  }
};

function json(obj) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}
