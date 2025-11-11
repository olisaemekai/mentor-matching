import { login, loginUser, storeUser } from "@/routes/user-profile";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RegistrationPage() {
    const { data, setData, post, submit, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "mentor",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(storeUser(),
            {
                onSuccess: () => {
                    toast.success('User Created successfully!');
                },
                onError: (error) => {
                    console.log(error)
                    toast('Error creating User');

                }
            })
    };
    return (
        <div className="relative isolate bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Join MentorConnect
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Sign up to become a <span className="font-semibold text-indigo-600 dark:text-indigo-400">Mentor</span> or <span className="font-semibold text-indigo-600 dark:text-indigo-400">Mentee</span>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 px-8 py-10 rounded-2xl shadow-lg ring-1 ring-gray-200 dark:ring-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                Full name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                Password
                            </label>
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-md bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                                Sign up as
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) => setData("role", e.target.value)}
                                    className="block w-full appearance-none rounded-md bg-white dark:bg-gray-900 py-2 pl-3 pr-8 text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-white/10 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                                >
                                    <option value="mentor">Mentor</option>
                                    <option value="mentee">Mentee</option>
                                </select>
                                <ChevronDownIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
                            >
                                {processing ? "Signing up..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href={loginUser().url}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
