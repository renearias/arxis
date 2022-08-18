export interface EndPointConfig {
  /**
   * URL base para los endpoints.
   */
  url: string;

  /**
   * Headers que se inyectarán de manera global.
   */
  readonly globalHeaders?: Record<string, string | string[]>;
}
