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
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { authClient } from '@/lib/auth-client'


const registerSchema = z.object({
    name: z.string().min(2, "name must be at least 2 characters"),
    email: z.email("please enter your email address"),
    password: z.string().min(6, "password must be at least 6 characters")
})

type registerFormValues = z.infer<typeof registerSchema>

const RegisterForm = () => {

    const router = useRouter();

    const form = useForm<registerFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit = async (data: registerFormValues) => {
        const user = await authClient.signUp.email(
            {
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: "/"
            },
            {
                onSuccess: () => {
                    toast.success("Account created successfully!");
                    router.push("/");
                },
                onError: (error) => {
                    toast.error(`Error: ${error.error.message}`);
                }
            }
        )
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
                            Register
                        </CardTitle>
                        <CardDescription className="text-center text-white/60">
                            Sign up to your account to continue
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
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-white/80">
                                                    Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Anurag"
                                                        className="bg-white/5  border-white/10 text-white placeholder-white/40 focus-visible:ring-white/30"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                    already have an account?{" "}
                                    <a
                                        href="/login"
                                        className="text-white hover:underline"
                                    >
                                        Sign in
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

export default RegisterForm