// resources/js/Pages/Welcome.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { login, registration } from '@/routes/user-profile';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="relative flex justify-between items-center py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-indigo-600">MentorConnect</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link
                        href={login()}
                        // href={route('login')}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        Sign in
                    </Link>
                    <Link
                        href={registration()}

                        // href={route('register')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative py-16 px-4 sm:px-6 lg:px-8 lg:py-32">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        Find Your Perfect
                        <span className="block text-indigo-600">Mentorship Match</span>
                    </h1>
                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                        Connect with experienced mentors or guide the next generation.
                        Our intelligent matching algorithm creates meaningful professional relationships
                        based on skills, goals, and compatibility.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href={registration()}

                            // href={route('register')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Start Your Journey
                        </Link>
                        <Link
                            href={login()}
                            // href={route('login')}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Choose MentorConnect?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            We make mentorship meaningful and effective
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                        <Feature
                            icon="🎯"
                            title="Smart Matching"
                            description="Our advanced algorithm matches you with the perfect mentor or mentee based on skills, experience, and goals."
                        />
                        <Feature
                            icon="📈"
                            title="Track Progress"
                            description="Set goals, track milestones, and measure your growth throughout the mentorship journey."
                        />
                        <Feature
                            icon="🤝"
                            title="Build Connections"
                            description="Form lasting professional relationships that accelerate your career development and personal growth."
                        />
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            How It Works
                        </h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
                        <Step
                            number="1"
                            title="Create Your Profile"
                            description="Tell us about your skills, experience, and what you're looking for in a mentorship."
                        />
                        <Step
                            number="2"
                            title="Get Matched"
                            description="Our algorithm suggests compatible mentors or mentees based on your profile."
                        />
                        <Step
                            number="3"
                            title="Connect & Grow"
                            description="Start your mentorship journey with structured guidance and support."
                        />
                        <Step
                            number="4"
                            title="Achieve Goals"
                            description="Track progress and celebrate milestones as you advance in your career."
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to transform your career?</span>
                        <span className="block">Join MentorConnect today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        Whether you're seeking guidance or looking to give back, start your mentorship journey now.
                    </p>
                    <Link
                        href={registration()}

                        // href={route('register')}
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                    >
                        Get Started Free
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xl font-bold text-white">MentorConnect</span>
                            <p className="mt-2 text-gray-400">
                                Building meaningful professional relationships.
                            </p>
                        </div>
                        <div className="flex space-x-6">
                            <Link
                                href={login()}
                                // href={route('login')} 
                                className="text-gray-400 hover:text-white">
                                Sign In
                            </Link>
                            <Link
                                href={registration()}

                                // href={route('register')} 
                                className="text-gray-400 hover:text-white">
                                Register
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-8">
                        <p className="text-gray-400 text-sm">
                            &copy; 2024 MentorConnect. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

interface FeatureProps {
    icon: string;
    title: string;
    description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-md bg-indigo-500 text-white text-2xl mx-auto">
                {icon}
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-600">{description}</p>
        </div>
    );
}

interface StepProps {
    number: string;
    title: string;
    description: string;
}

function Step({ number, title, description }: StepProps) {
    return (
        <div className="text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white text-lg font-bold mx-auto">
                {number}
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-600">{description}</p>
        </div>
    );
}