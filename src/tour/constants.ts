const IS_DEVELOPMENT = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// ngrok's free tier injects a browser-warning page that corrupts the fetched locale JSON
const LOCALE_REQUEST_OBJECT: RequestInit | undefined = IS_DEVELOPMENT
  ? { headers: { 'ngrok-skip-browser-warning': 'any' } }
  : undefined;

export { LOCALE_REQUEST_OBJECT };
