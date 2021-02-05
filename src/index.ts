import * as QRCode from "qrcode";

import { formatValue, getCRC16 } from "./utils";

type CreateStaticPixParams = {
  pixKey: string;
  description?: string;
  merchant: string;
  merchantCity: string;
  transactionId: string;
  amount?: string;
  cep?: string;
};

type StaticPix = {
  payload: string;
  qrcode: string;
};

const getMerchantAccountInformation = (pixKey: string, paymentDescription?: string) => {
  // Bank Domain
  const gui = formatValue("MERCHANT_ACCOUNT_INFORMATION_GUI", "br.gov.bcb.pix");

  //   PIX Key
  const key = formatValue("MERCHANT_ACCOUNT_INFORMATION_KEY", pixKey);

  let merchantAccountInformation = `${gui}${key}`;

  if (paymentDescription) {
    merchantAccountInformation += formatValue("MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION", paymentDescription);
  }

  return formatValue("MERCHANT_ACCOUNT_INFORMATION", merchantAccountInformation);
};

const getAdditionalDataField = (userTxid: string) => {
  // TX ID
  const txId = formatValue("ADDITIONAL_DATA_FIELD_TEMPLATE_TXID", userTxid);

  const additionalData = formatValue("ADDITIONAL_DATA_FIELD_TEMPLATE", txId);

  return additionalData;
};

const getQrCodeFromPayload = async (payload: string): Promise<string> => {
  return await QRCode.toDataURL(payload);
};

const staticPix = async (params: CreateStaticPixParams): Promise<StaticPix> => {
  let payload = [
    formatValue("PAYLOAD_FORMAT_INDICATOR", "01"),
    getMerchantAccountInformation(params.pixKey, params.description),
    formatValue("MERCHANT_CATEGORY_CODE", "0000"),
    formatValue("TRANSACTION_CURRENCY", "986"),
  ];

  if (params.amount) {
    payload.push(formatValue("TRANSACTION_AMOUNT", params.amount));
  }

  payload = [...payload, formatValue("COUNTRY_CODE", "BR"), formatValue("MERCHANT_NAME", params.merchant), formatValue("MERCHANT_CITY", params.merchantCity)];

  if (params.cep) {
    payload.push(formatValue("POSTAL_CODE", params.cep));
  }

  payload.push(getAdditionalDataField(params.transactionId));

  payload.push("6304");

  const payloadAsString = payload.join("");

  const crcResult = getCRC16(payloadAsString);

  const pixCopyAndPaste = `${payloadAsString}${crcResult}`;

  return {
    payload: pixCopyAndPaste,
    qrcode: await getQrCodeFromPayload(pixCopyAndPaste),
  };
};

export { staticPix };
