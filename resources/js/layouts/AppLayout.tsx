// resources/js/Layouts/AppLayout.tsx
import React, { ReactNode } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { PageProps, User } from '../types';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };

    // console.log(auth.user.role)

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">MentorConnect</span>
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <NavLink href="/dashboard">Dashboard</NavLink>
                                <NavLink href="/matches">Matches</NavLink>
                                {auth.user.role === 'admin' && (
                                    <>
                                        <NavLink href="/admin/dashboard">Admin</NavLink>
                                        <NavLink href="/admin/users">Users</NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/profile"
                                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                {auth.user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
            {children}
        </Link>
    );
}