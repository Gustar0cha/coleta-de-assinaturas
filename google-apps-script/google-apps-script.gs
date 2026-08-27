const SPREADSHEET_ID = "1-VwMdhb151MQ-Y5877iPESGK3fCqtFULUKqR1GUcwf0";
const SHEET_NAME = "Assinaturas";
const API_SECRET = "d9ea110ac0e544e788db3a9d6814d03be735fbe56eb84057941d541d3481662f";

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const payload = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : "{}");

    if (payload.secret !== API_SECRET) {
      return jsonResponse({ success: false, code: "UNAUTHORIZED" });
    }

    const name = normalizeName(payload.name);
    const cpf = onlyDigits(String(payload.cpf || ""));

    if (!isValidName(name)) {
      return jsonResponse({ success: false, code: "INVALID_NAME" });
    }

    if (!isValidCpf(cpf)) {
      return jsonResponse({ success: false, code: "INVALID_CPF" });
    }

    const sheet = getSheet();
    ensureHeader(sheet);

    if (cpfExists(sheet, cpf)) {
      return jsonResponse({ success: false, code: "CPF_ALREADY_EXISTS" });
    }

    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || "America/Sao_Paulo",
      "dd/MM/yyyy HH:mm:ss",
    );

    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 3).setNumberFormat("@");
    sheet.getRange(nextRow, 1, 1, 3).setValues([[timestamp, name, cpf]]);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, code: "INTERNAL_ERROR" });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader(sheet) {
  sheet.getRange("C:C").setNumberFormat("@");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["DATA/HORA", "NOME", "CPF"]);
    return;
  }

  const header = sheet.getRange(1, 1, 1, 3).getValues()[0];
  if (header[0] !== "DATA/HORA" || header[1] !== "NOME" || header[2] !== "CPF") {
    sheet.getRange(1, 1, 1, 3).setValues([["DATA/HORA", "NOME", "CPF"]]);
  }
}

function cpfExists(sheet, cpf) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const values = sheet.getRange(2, 3, lastRow - 1, 1).getDisplayValues();
  return values.some(function (row) {
    return normalizeStoredCpf(row[0]) === cpf;
  });
}

function normalizeStoredCpf(value) {
  const digits = onlyDigits(String(value || ""));

  if (digits.length === 10) {
    return "0" + digits;
  }

  return digits;
}

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function isValidName(name) {
  return name.length >= 5 && name.split(" ").filter(Boolean).length >= 2;
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function isValidCpf(value) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const numbers = cpf.split("").map(function (digit) {
    return Number(digit);
  });

  let firstSum = 0;
  for (let index = 0; index < 9; index += 1) {
    firstSum += numbers[index] * (10 - index);
  }
  const firstCheck = firstSum % 11 < 2 ? 0 : 11 - (firstSum % 11);

  if (numbers[9] !== firstCheck) {
    return false;
  }

  let secondSum = 0;
  for (let index = 0; index < 10; index += 1) {
    secondSum += numbers[index] * (11 - index);
  }
  const secondCheck = secondSum % 11 < 2 ? 0 : 11 - (secondSum % 11);

  return numbers[10] === secondCheck;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
