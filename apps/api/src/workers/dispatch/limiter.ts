class DiscordRateLimiter {
  private nextAvailableAt = 0;

  async waitIfNeeded() {
    const now = Date.now();
    if (now < this.nextAvailableAt) {
      await new Promise((res) => setTimeout(res, this.nextAvailableAt - now));
    }
  }

  applyHeaders(headers: Headers) {
    const remaining = headers.get("x-ratelimit-remaining");
    const resetAfter = headers.get("x-ratelimit-reset-after");
    if (remaining === "0" && resetAfter) {
      const delayMs = Math.ceil(Number.parseFloat(resetAfter) * 1000);
      this.nextAvailableAt = Date.now() + delayMs;
    }
  }

  applyRetryAfter(headers: Headers) {
    const retryAfter = headers.get("retry-after");
    if (retryAfter) {
      const delayMs = Math.ceil(Number.parseFloat(retryAfter) * 1000);
      this.nextAvailableAt = Date.now() + delayMs;
    }
  }
}

const limiterMap = new Map<string, DiscordRateLimiter>();

export const getLimiter = (key: string) => {
  let limiter = limiterMap.get(key);
  if (!limiter) {
    limiter = new DiscordRateLimiter();
    limiterMap.set(key, limiter);
  }
  return limiter;
};

export type { DiscordRateLimiter };
