export type HttpErrorKind = 'network' | 'notFound' | 'server' | 'parse';

/** One error type for every request, so the UI can show the right message for each case. */
export class HttpError extends Error {
    readonly kind: HttpErrorKind;
    readonly status?: number;

    constructor(kind: HttpErrorKind, message: string, status?: number) {
        super(message);
        this.name = 'HttpError';
        this.kind = kind;
        this.status = status;
    }
}

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    let response: Response;
    try {
        response = await fetch(url, { signal });
    } catch (error) {
        // A cancelled request isn't a failure: TanStack Query cancels requests it no longer needs.
        if (error instanceof DOMException && error.name === 'AbortError') throw error;
        throw new HttpError('network', `Network error while loading ${url}`);
    }

    if (!response.ok) {
        const kind = response.status === 404 ? 'notFound' : 'server';
        throw new HttpError(kind, `${response.status} while loading ${url}`, response.status);
    }

    try {
        return (await response.json()) as T;
    } catch {
        // The Vite dev server answers a missing file with index.html, which lands here.
        throw new HttpError('parse', `Invalid JSON in ${url}`);
    }
}