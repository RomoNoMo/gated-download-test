exports.handler = async function () {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({
      verified: true,
      message: "Demo ownership check passed",
    }),
  };
};
``