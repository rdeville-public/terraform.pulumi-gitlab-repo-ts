import * as pulumi from "@pulumi/pulumi";

/**
 * Print a debug log message when not in test environment
 *
 * @param {string} message - Content of the message to print
 * @returns {string} Empty string if in test environment
 */
export function debug (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.debug(message).catch(null);
    }
    return "";
}

/**
 * Print a info log message when not in test environment
 *
 * @param {string} message - Content of the message to print
 * @returns {string} Empty string if in test environment
 */
export function info (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.info(message).catch(null);
    }
    return "";
}

/**
 * Print a warning log message when not in test environment
 *
 * @param {string} message - Content of the message to print
 * @returns {string} Empty string if in test environment
 */
export function warn (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.warn(message).catch(null);
    }
    return "";
}

/**
 * Print a error log message when not in test environment
 *
 * @param {string} message - Content of the message to print
 * @returns {string} Empty string if in test environment
 */
export function error (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.error(message).catch(null);
    }
    return "";
}
