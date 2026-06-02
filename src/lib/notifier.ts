/**
 * Notification abstraction using the Strategy Pattern.
 *
 * Add a new provider by implementing INotificationService and
 * updating getNotifier() — no other code needs to change.
 */

export interface INotificationService {
  send(to: string, message: string): Promise<void>;
}

/** Development / MVP fallback — prints to server stdout. */
export class ConsoleNotificationService implements INotificationService {
  async send(to: string, message: string): Promise<void> {
    console.log('─────────────────────────────────────────');
    console.log('[SMS NOTIFICATION]');
    console.log(`  To:      ${to}`);
    console.log(`  Message: ${message}`);
    console.log(`  Time:    ${new Date().toISOString()}`);
    console.log('─────────────────────────────────────────');
  }
}

/**
 * Placeholder for the local Georgian SMS provider.
 * Replace the fetch body/headers with the real provider's API contract.
 */
export class GeorgianSmsNotificationService implements INotificationService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.GEORGIAN_SMS_API_KEY ?? '';
    this.apiUrl = process.env.GEORGIAN_SMS_API_URL ?? '';

    if (!this.apiKey || !this.apiUrl) {
      throw new Error(
        'GeorgianSmsNotificationService: GEORGIAN_SMS_API_KEY and GEORGIAN_SMS_API_URL must be set.'
      );
    }
  }

  async send(to: string, message: string): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      // Adjust the payload shape to match the provider's API specification.
      body: JSON.stringify({ recipient: to, text: message }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Georgian SMS provider returned ${response.status}: ${body}`
      );
    }
  }
}

/**
 * Factory — returns the correct notifier based on environment.
 * Set USE_REAL_SMS=true in production to activate the real provider.
 */
export function getNotifier(): INotificationService {
  if (process.env.USE_REAL_SMS === 'true') {
    return new GeorgianSmsNotificationService();
  }
  return new ConsoleNotificationService();
}
