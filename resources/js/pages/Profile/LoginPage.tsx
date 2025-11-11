import { loginUser, registration } from "@/routes/user-profile";
import { useForm, Link } from "@inertiajs/react";
import { toast } from "sonner";

export default function LoginPage() {
    const { data, setData, post, submit, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(loginUser(), {
            onSuccess: () => {
                toast.success("Welcome back!");
                reset("password");
            },
            onError: () => {
                toast.error("Invalid credentials. Please try again.");
            },
        });
    };

    return (
        <div className="relative isolate bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
            {/* Background Accent */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 opacity-70"></div>

            {/* Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back to MentorConnect
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign in to continue your mentoring journey
                </p>
            </div>

            {/* Form Container */}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 px-8 py-10 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link
                                        // href={route("password.request")}
                                        className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-gray-900 dark:border-gray-700"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
                            >
                                {processing ? "Signing in..." : "Sign In"}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don’t have an account?{" "}
                        <Link
                            href={registration()}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
