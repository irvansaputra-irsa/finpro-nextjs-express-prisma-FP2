export default function parseJWT(token: string) {
  try {
    if (!token || undefined) throw new Error('token missing');

    const base64url = token.split('.')[1];
    if (!base64url || undefined) {
      throw new Error('Invalid JWT format: missing payload');
    }
    const base64 = base64url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  } catch (err) {
    throw err;
  }
}
