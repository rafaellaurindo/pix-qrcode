import crcTable from "./crc-table";

type PayloadValueKey =
  | "PAYLOAD_FORMAT_INDICATOR"
  | "MERCHANT_ACCOUNT_INFORMATION"
  | "MERCHANT_ACCOUNT_INFORMATION_GUI"
  | "MERCHANT_ACCOUNT_INFORMATION_KEY"
  | "MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION"
  | "MERCHANT_CATEGORY_CODE"
  | "TRANSACTION_CURRENCY"
  | "TRANSACTION_AMOUNT"
  | "COUNTRY_CODE"
  | "MERCHANT_NAME"
  | "MERCHANT_CITY"
  | "POSTAL_CODE"
  | "ADDITIONAL_DATA_FIELD_TEMPLATE"
  | "ADDITIONAL_DATA_FIELD_TEMPLATE_TXID"
  | "CRC16";

const PAYLOAD_IDs = {
  PAYLOAD_FORMAT_INDICATOR: "00",
  MERCHANT_ACCOUNT_INFORMATION: "26",
  MERCHANT_ACCOUNT_INFORMATION_GUI: "00",
  MERCHANT_ACCOUNT_INFORMATION_KEY: "01",
  MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION: "02",
  MERCHANT_CATEGORY_CODE: "52",
  TRANSACTION_CURRENCY: "53",
  TRANSACTION_AMOUNT: "54",
  COUNTRY_CODE: "58",
  MERCHANT_NAME: "59",
  MERCHANT_CITY: "60",
  POSTAL_CODE: "61",
  ADDITIONAL_DATA_FIELD_TEMPLATE: "62",
  ADDITIONAL_DATA_FIELD_TEMPLATE_TXID: "05",
  CRC16: "63",
};

const formatValue = (id: PayloadValueKey, value: string) => {
  const emvId = PAYLOAD_IDs[id];
  const size = value.length.toString().padStart(2, "0");

  return `${emvId}${size}${value}`;
};

const getCRC16 = (payload: any) => {
  let crc = 0xffff;
  let j, i;
  for (i = 0; i < payload.length; i++) {
    const c = payload.charCodeAt(i);
    if (c > 255) throw new RangeError();
    j = (c ^ (crc >> 8)) & 0xff;
    crc = crcTable[j] ^ (crc << 8);
  }
  return ((crc ^ 0) & 0xffff).toString(16).toUpperCase();
};

export { formatValue, getCRC16 };
