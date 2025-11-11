// resources/js/Pages/Admin/Users/Index.tsx
import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '../../../Layouts/AppLayout';
import Card from '../../../Components/UI/Card';
import Button from '../../../Components/UI/Button';
import { PageProps, User } from '../../../types';
import { detail, index } from '@/routes/admin/users';
import { dashboard } from '@/routes/admin';

interface UsersIndexProps {
    users: {
        data: User[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
    stats: {
        total: number;
        mentors: number;
        mentees: number;
        active: number;
        inactive: number;
    };
}

export default function UsersIndex() {
    const { users, filters, stats } = usePage<PageProps<UsersIndexProps>>().props;

    console.log(users)
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        role: filters.role || '',
        status: filters.status || ''
    });

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get(index().url, localFilters, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setLocalFilters({ search: '', role: '', status: '' });
        router.get(index().url);
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage all users and their mentorship relationships</p>
                        </div>
                        <Link href={dashboard()}>
                            <Button variant="secondary">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <StatCard title="Total Users" value={stats.total} />
                    <StatCard title="Mentors" value={stats.mentors} />
                    <StatCard title="Mentees" value={stats.mentees} />
                    <StatCard title="Active" value={stats.active} color="green" />
                    <StatCard title="Inactive" value={stats.inactive} color="red" />
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                value={localFilters.search}
                                onChange={e => handleFilterChange('search', e.target.value)}
                                placeholder="Search by name, email, industry..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={localFilters.role}
                                onChange={e => handleFilterChange('role', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Roles</option>
                                <option value="mentor">Mentor</option>
                                <option value="mentee">Mentee</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={localFilters.status}
                                onChange={e => handleFilterChange('status', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end space-x-2">
                            <Button onClick={applyFilters} className="w-full">
                                Apply Filters
                            </Button>
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Users Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Industry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <UserRow key={user.id} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination meta={users} />
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    color?: 'green' | 'red' | 'blue';
}

function StatCard({ title, value, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        red: 'bg-red-50 text-red-700'
    };

    return (
        <Card className={`text-center ${colorClasses[color]}`}>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </Card>
    );
}

interface UserRowProps {
    user: User;
}

function UserRow({ user }: UserRowProps) {
    const getRoleBadge = (role: string) => {
        const roles = {
            mentor: { color: 'bg-purple-100 text-purple-800', label: 'Mentor' },
            mentee: { color: 'bg-blue-100 text-blue-800', label: 'Mentee' },
            both: { color: 'bg-indigo-100 text-indigo-800', label: 'Both' },
            admin: { color: 'bg-indigo-100 text-indigo-800', label: 'Admin' },
        };
        const roleConfig = roles[role as keyof typeof roles] || roles.mentee;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                {roleConfig.label}
            </span>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactive
            </span>
        );
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {user.experience_level?.replace('_', ' ') || 'Not set'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.industry || 'Not set'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.is_active)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                    href={detail(user.id).url}
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    View Details
                </Link>
            </td>
        </tr>
    );
}

interface PaginationProps {
    meta: any;
}

function Pagination({ meta }: PaginationProps) {
    const previousPage = meta.current_page > 1 ? meta.current_page - 1 : null;
    const nextPage = meta.current_page < meta.last_page ? meta.current_page + 1 : null;

    return (
        <nav className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{meta.from}</span> to{' '}
                    <span className="font-medium">{meta.to}</span> of{' '}
                    <span className="font-medium">{meta.total}</span> results
                </p>
            </div>
            <div className="flex space-x-2">
                {previousPage && (
                    <Link
                        href={meta.links[0].url}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Previous
                    </Link>
                )}
                {nextPage && (
                    <Link
                        href={meta.links[meta.links.length - 1].url}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Next
                    </Link>
                )}
            </div>
        </nav>
    );
}