import { Auth, User, UserCredential, signInWithEmailAndPassword } from "firebase/auth";

export var AUTH_CACHE: Record<string, User> = {};

export async function signInWithEmailAndPasswordCache(auth: Auth, email: string, password: string, source: string) {
    if (email === '@memcara.com') {
        console.log('returning null');
        return null;
    }
    if (AUTH_CACHE[`email:${email}`]) {
        console.log('SIGN-IN retrieving auth from cache' + source);
        return AUTH_CACHE[`email:${email}`];
    } else {
        console.log('SIGN-IN missing from cache from source' + source);
    }
    console.log('querying firebase with cred: ', email, password);
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result) {
        console.log('SIGN-IN update auth from source' + source);
        AUTH_CACHE[`email:${email}`] = result.user;
    } else {
        console.log('SIGN-IN invalid auth from source' + source);
    }
    return result.user;
}

export function updateCache(user: User | undefined) {
    if (user) {
        AUTH_CACHE[`email:${user.email}`] = user;
    }
}

export function resetAuthCache() {
    AUTH_CACHE = {};
}