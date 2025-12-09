'use client'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form'


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
    console.log(data);
  }

  const pending = form.formState.isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/90 px-4">
      <div className="w-full max-w-md">
        <Card className="relative border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          {/* subtle glass highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/5" />

          <CardHeader className="space-y-1 relative">
            <CardTitle className="text-2xl font-semibold tracking-tight text-center text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-white/60">
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
                    className="w-full bg-white/5 cursor-pointer border-white/10 text-white hover:bg-white/10"
                    disabled={pending}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full bg-white/5 cursor-pointer border-white/10 text-white hover:bg-white/10"
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
                        <FormLabel className="text-sm text-white/80">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="anurag@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder-white/40 focus-visible:ring-white/30"
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
                          <FormLabel className="text-sm text-white/80">
                            Password
                          </FormLabel>

                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            className="bg-white/5 border-white/10 text-white placeholder-white/40 focus-visible:ring-white/30"
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
                  className="w-full bg-white text-black hover:bg-white/90 font-medium"
                  disabled={pending}
                >
                  {pending ? "Signing in..." : "Sign in"}
                </Button>

                {/* Footer */}
                <p className="text-center text-xs text-white/50">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="text-white hover:underline"
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