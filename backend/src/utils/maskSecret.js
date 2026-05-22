export const maskSecret = (secret) => {
  if (!secret) {
    return 'not set';
  }

  if (secret.length <= 8) {
    return `${secret.slice(0, 2)}***`;
  }

  return `${secret.slice(0, 3)}...${secret.slice(-4)}`;
};
