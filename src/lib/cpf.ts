export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const numbers = cpf.split("").map(Number);

  const firstSum = numbers
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const firstCheck = firstSum % 11 < 2 ? 0 : 11 - (firstSum % 11);

  if (numbers[9] !== firstCheck) {
    return false;
  }

  const secondSum = numbers
    .slice(0, 10)
    .reduce((sum, digit, index) => sum + digit * (11 - index), 0);
  const secondCheck = secondSum % 11 < 2 ? 0 : 11 - (secondSum % 11);

  return numbers[10] === secondCheck;
}
