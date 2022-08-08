import { SessionWallet } from 'algorand-session-wallet';

export let sw: null | SessionWallet;

export function setSW(newSW: SessionWallet) {
  sw = newSW;
}
