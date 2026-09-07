export type PreserveMatcher = string | RegExp;

export interface PruneCssVarsOptions {
	/**
	 * Glob patterns for files to scan.
	 */
	include?: ReadonlyArray<string>;

	/**
	 * Glob patterns to ignore.
	 */
	exclude?: ReadonlyArray<string>;

	/**
	 * Variables that should never be removed.
	 */
	preserve?: ReadonlyArray<PreserveMatcher>;

	/**
	 * Enables debug logging.
	 */
	debug?: boolean;
}
