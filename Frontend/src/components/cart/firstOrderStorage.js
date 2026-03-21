import { STORAGE_KEYS } from "./cartConstants";

/**
 * @param {string | undefined} userId
 * @returns {boolean} true if the user has not completed any order yet (eligible for first-order promos)
 */
export function readIsFirstOrder(userId) {
  if (!userId) return true;
  return localStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ORDER(userId)) !== "true";
}

/**
 * Call after a successful checkout while logged in.
 * @param {string | undefined} userId
 */
export function markFirstOrderCompleted(userId) {
  if (!userId) return;
  localStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ORDER(userId), "true");
}
