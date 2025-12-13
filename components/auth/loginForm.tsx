'use client'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth-client'
import { Github } from 'lucide-react'


const loginSchema = z.object({
  email: z.email("please enter your email address"),
  password: z.string().min(6, "password must be at least 6 characters")
})

type loginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {

  const router = useRouter();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: loginFormValues) => {
    const user = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/'
    }, {

      onSuccess: () => {
        toast.success("Successfully logged in!");
        router.push('/');
      },

      onError: (error) => {
        toast.error(`Login failed: ${error.error.message}`);
      }

    })
  }

  const pending = form.formState.isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md">
        <Card className="relative borderbackdrop-blur-xl shadow-xl">
          {/* subtle glass highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-xl " />

          <CardHeader className="space-y-1 relative">
            <CardTitle className="text-2xl font-semibold tracking-tight text-center ">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center ">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 relative">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* OAuth buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
                    disabled={pending}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
                    disabled={pending}
                  >
                    Continue with GitHub
                  </Button>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm ">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="anurag@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm ">
                            Password
                          </FormLabel>

                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full  font-medium"
                  disabled={pending}
                >
                  {pending ? "Signing in..." : "Sign in"}
                </Button>

                {/* Footer */}
                <p className="text-center text-xs ">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="hover:underline"
                  >
                    Create one
                  </a>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm