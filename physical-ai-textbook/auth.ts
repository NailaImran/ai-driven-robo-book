import { betterAuth } from "better-auth";
import { disableCSRFProtection } from "better-auth/api";

export const auth = betterAuth({
  database: {
    type: "sqlite",
    file: "./auth.db",
  },
  emailAndPassword: {
    enabled: true,
    autoSignUpEmail: false,
  },
  plugins: [
    disableCSRFProtection(),
  ],
});

export type Session = typeof auth.$Infer.Session;
