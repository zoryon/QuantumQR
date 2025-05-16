/**
 * Custom error for situations where an entry already exists,
 * typically leading to a 409 Conflict response.
 */
export class DuplicateEntryError extends Error {
    constructor(message: string = "This entry already exists.") {
        super(message);
        this.name = "DuplicateEntryError";
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, DuplicateEntryError.prototype);
    }
}