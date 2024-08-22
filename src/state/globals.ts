import { Auth, User, UserCredential, signInWithEmailAndPassword } from "firebase/auth";

export var AUTH_CACHE: Record<string, User> = {};
export var LOADED_CACHE = false;
export var IS_ADMIN = false;

export function setLoadedQueryFromURLTrue() {
    LOADED_CACHE = true;
}

export function getLoadedQueryFromURL() {
    return LOADED_CACHE;
}

export async function signInWithEmailAndPasswordCache(auth: Auth, email: string, password: string, source: string) {
    if (email === '@memcara.com') {
        // console.log('returning null');
        return null;
    }
    if (AUTH_CACHE[`email:${email}`]) {
        // console.log('SIGN-IN retrieving auth from cache' + source);
        return AUTH_CACHE[`email:${email}`];
    } else {
        // console.log('SIGN-IN missing from cache from source' + source);
    }
    // console.log('querying firebase with cred: ', email, password);
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result) {
        // console.log('SIGN-IN update auth from source' + source);
        AUTH_CACHE[`email:${email}`] = result.user;
        const r = (await result.user.getIdTokenResult());
        if (r) {
            IS_ADMIN = r.claims.role !== undefined && (r.claims.role === "Facility Admin" || r.claims.role === "Facility Caregiver");
        }
    } else {
        // console.log('SIGN-IN invalid auth from source' + source);
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
    LOADED_CACHE = false;
    IS_ADMIN = false;
}