"use client";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signInWithEmail(data);

    if (!result.success) {
      toast.error("Sign in failed", {
        description: result.error ?? "Invalid email or password",
      });
      return;
    }

    toast.success("Welcome back!");

    router.push("/");
  };

  return (
    <>
      <h1 className="form-title">Login to your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="artemis@gmail.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is Required",
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email address is required",
          }}
        />
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required ", minLength: 8 }}
        />

        <Button
          type="submit"
          className="mt-5 w-full yellow-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging In..." : "Log In"}
        </Button>
        <FooterLink
          text="Don't have an account?"
          linkText="Create an Account"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignIn;
