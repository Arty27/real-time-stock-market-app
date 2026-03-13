"use server";

import { success } from "better-auth";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          riskTolerance,
          investmentGoals,
          preferredIndustry,
        },
      });
    }
    return { success: true, data: response };
  } catch (error) {
    console.log("Sign Up Failed", error);
    return { success: false, error: "Signup Failed" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.log("Sign out failed", error);
    return { success: false, error: "Sign Out failed!" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
    return { success: true, data: response };
  } catch (error) {
    console.log("Failed to Sign In", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to Sign In",
    };
  }
};
