const { staticPix } = require("../lib");

(async () => {
  const pixCode = await staticPix({
    pixKey: "fulano2019@example.com",
    description: "PAGAMENTO DO SOFTWARE",
    merchant: "FULANO DE TAL",
    merchantCity: "FORTALEZA",
    transactionId: "TX1234",
    amount: "1500.00",
  });

  console.log(pixCode);
  // {
  //   payload: "00020126690014br...63049620",
  //   qrcode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEU...5ErkJggg==",
  // };
})();
