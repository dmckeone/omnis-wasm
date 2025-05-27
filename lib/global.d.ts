// Omnis injects the "omnis_calls" module dynamically on import
declare module 'omnis_calls';

// Omnis adds a dynamic element to the Error class to track the error code
interface Error { errorCode: number; }

// Omnis loads modules using globalThis.loadModule -- we can replicate this in typescript for the build system
function loadModule(item: string): any;
