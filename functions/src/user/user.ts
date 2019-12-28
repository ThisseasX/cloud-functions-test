interface User {
  name: string;
  pass: string;
}

function isUser(obj: any): obj is User {
  return typeof obj?.name === 'string' && typeof obj?.pass === 'string';
}

export { User, isUser };
