import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "./logger";

function initFirebase() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set");
  }

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }

  const app = initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId: "amthal-bahrain",
  });

  logger.info("Firebase Admin SDK initialized");
  return app;
}

initFirebase();

export const auth = getAuth();
