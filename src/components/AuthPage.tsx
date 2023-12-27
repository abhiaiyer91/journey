import React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

import { PolicyTerms } from "@/components/PolicyTerms";
import { JourneySplash } from "@/components/JourneySplash";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  current: string;
}

const authSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export function AuthPage({ current }: { current: string }) {
  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href={current === "login" ? "/signup" : "/login"}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {current === "login" ? "Sign up" : "Log in"}
      </Link>
      <JourneySplash />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {`Sign ${current === "login" ? "in" : "up"}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign {current === "login" ? "in" : "up"}
            </p>
          </div>
          <UserAuthForm current={current} />
          <PolicyTerms />
        </div>
      </div>
    </div>
  );
}

export function UserAuthForm({
  className,
  current,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setIsLoading(true);

    if (current === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values?.email,
        password: values?.password,
      });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
    }

    setTimeout(() => {
      setIsLoading(false);

      router.push("/");
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {`Sign ${current === "login" ? "In" : "Up"} with Email`}
            </Button>
          </div>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
      {/* <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button> */}
    </div>
  );
}
