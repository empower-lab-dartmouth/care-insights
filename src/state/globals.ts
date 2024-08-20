import { Auth, UserCredential, signInWithEmailAndPassword } from "firebase/auth";

export var AUTH_CACHE: Record<string, UserCredential> = {};

export async function signInWithEmailAndPasswordCache(auth: Auth, email: string, password: string, source: string) {
    if (AUTH_CACHE[`email:${email}-password${password}`]) {
        console.log('SIGN-IN retrieving auth from cache' + source);
        return AUTH_CACHE[`email:${email}-password${password}`];
    } else {
        console.log('SIGN-IN error from source' + source);
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result) {
        console.log('SIGN-IN update auth from source' + source);
        AUTH_CACHE[`email:${email}-password${password}`] = result;
    } else {
        console.log('SIGN-IN invalid auth from source' + source);
    }
    return result;
}

export function resetAuthCache() {
    AUTH_CACHE = {};
}