"use client";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm } from "react-hook-form";

const SignIn = () => {
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
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
