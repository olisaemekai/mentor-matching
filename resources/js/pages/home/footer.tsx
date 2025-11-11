import { Link } from '@inertiajs/react'
import React from 'react'
// import Link from 'next/link'

const footerNavigation = {
    connect: [
        { name: 'Become a Mentor', href: '/become-mentor' },
        { name: 'Find a Mentor', href: '/become-mentee' },
        { name: 'Browse Mentors', href: '/mentors' },
    ],
    about: [
        { name: 'About MentorConnect', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
    ],
    legal: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
    ],
}

const Footer = () => {
    return (
        <footer className="relative mt-32 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="md:grid md:grid-cols-3 md:gap-8">
                    {/* Brand Section */}
                    <div>
                        <Link href="/" className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                            MentorConnect
                        </Link>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-6 max-w-sm">
                            Connecting mentors and mentees to learn, grow, and achieve goals together.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-10 grid grid-cols-2 gap-8 md:mt-0 md:col-span-2">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Connect</h3>
                            <ul className="mt-4 space-y-3">
                                {footerNavigation.connect.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">About</h3>
                            <ul className="mt-4 space-y-3">
                                {footerNavigation.about.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
                            <ul className="mt-4 space-y-3">
                                {footerNavigation.legal.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} MentorConnect. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
