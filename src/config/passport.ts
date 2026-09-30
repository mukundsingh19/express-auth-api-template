import { configureLocalStrategy } from '../strategies/local.strategy.js';
import { configureGoogleStrategy } from '../strategies/google.strategy.js';
import { configureGitHubStrategy } from '../strategies/github.strategy.js';

export function configurePassport(): void {
  configureLocalStrategy();
  configureGoogleStrategy();
  configureGitHubStrategy();
}
