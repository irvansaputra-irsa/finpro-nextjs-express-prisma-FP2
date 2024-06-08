export default function parseJWT(payload: any) {
  try {
    console.log('payload', payload);
    const { token } = payload;
    console.log('token', token);
    if (!token) throw new Error('token missing');
    console.log('masuk1');
    const base64url = token.split('.')[0];
    const base64 = base64url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  } catch (err) {
    throw err;
  }
}
