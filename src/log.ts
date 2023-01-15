import * as pulumi from "@pulumi/pulumi";

/**
 * [TODO:description]
 *
 * @param {string} message - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function debug (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.debug(message).catch(null);
    }
    return "";
}

/**
 * [TODO:description]
 *
 * @param {string} message - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function info (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.info(message).catch(null);
    }
    return "";
}

/**
 * [TODO:description]
 *
 * @param {string} message - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function warn (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.warn(message).catch(null);
    }
    return "";
}

/**
 * [TODO:description]
 *
 * @param {string} message - [TODO:description]
 * @returns {string} [TODO:description]
 */
export function error (message: string): string {
    /* c8 ignore next 3 */
    if (process.env.NODE_ENV !== "test") {
        pulumi.log.error(message).catch(null);
    }
    return "";
}
