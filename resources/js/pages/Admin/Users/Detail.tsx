// resources/js/Pages/Admin/Users/Detail.tsx
import React, { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import AppLayout from '../../../Layouts/AppLayout';
import Card from '../../../Components/UI/Card';
import Button from '../../../Components/UI/Button';
import { PageProps, User, MentorshipMatch, MatchSuggestion } from '../../../types';
import { index, update as updateProfile } from '@/routes/admin/users';
import { create, deleteMethod } from '@/routes/admin/matches';
import { update as updateCapacity } from '@/routes/admin/users/capacity';
import { update as updateMatchStatus } from '@/routes/admin/matches/status';

interface UserDetailProps {
    user: User;
    matches: MentorshipMatch[];
    matchStats: {
        total: number;
        active: number;
        pending: number;
        completed: number;
    };
    suggestedMatches: MatchSuggestion[];
}

export default function UserDetail() {
    const { user, matches, matchStats, suggestedMatches } = usePage<PageProps<UserDetailProps>>().props;

    const [activeTab, setActiveTab] = useState<'profile' | 'matches' | 'suggestions'>('profile');

    console.log(user)
    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-4">
                                <Link href={index()} className="text-indigo-600 hover:text-indigo-900">
                                    ← Back to Users
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="secondary" onClick={() => window.print()}>
                                Print Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Matches" value={matchStats.total} />
                    <StatCard title="Active" value={matchStats.active} color="green" />
                    <StatCard title="Pending" value={matchStats.pending} color="yellow" />
                    <StatCard title="Completed" value={matchStats.completed} color="blue" />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <TabButton
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile Details
                        </TabButton>
                        <TabButton
                            active={activeTab === 'matches'}
                            onClick={() => setActiveTab('matches')}
                        >
                            Mentorship Matches ({matches.length})
                        </TabButton>
                        <TabButton
                            active={activeTab === 'suggestions'}
                            onClick={() => setActiveTab('suggestions')}
                        >
                            Suggested Matches ({suggestedMatches.length})
                        </TabButton>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && <ProfileTab user={user} />}
                {activeTab === 'matches' && <MatchesTab user={user} matches={matches} />}
                {activeTab === 'suggestions' && <SuggestionsTab user={user} suggestions={suggestedMatches} />}
            </div>
        </AppLayout>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    color?: 'blue' | 'green' | 'yellow' | 'red';
}

function StatCard({ title, value, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        yellow: 'bg-yellow-50 text-yellow-700',
        red: 'bg-red-50 text-red-700'
    };

    return (
        <Card className={`text-center ${colorClasses[color]}`}>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </Card>
    );
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${active
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {children}
        </button>
    );
}

interface ProfileTabProps {
    user: User;
}

function ProfileTab({ user }: ProfileTabProps) {
    const { data, setData, put, submit, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        experience_level: user.experience_level,
        industry: user.industry || '',
        function: user.function || '',
        communication_style: user.communication_style || '',
        time_zone: user.time_zone || '',
        bio: user.bio || '',
        is_active: user.is_active,
    });

    const { data: capacityData, setData: setCapacityData, submit: postCapacity } = useForm({
        max_mentees: user.mentor_capacity?.max_mentees || 2,
        availability_status: user.mentor_capacity?.availability_status || 'available',
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        // put(route('admin.users.update', { user: user.id }));
        submit(updateProfile(user.id));
    };

    const submitCapacity = (e: React.FormEvent) => {
        e.preventDefault();
        postCapacity(updateCapacity(user.id));
        // route('admin.users.capacity.update', { user: user.id }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                <form onSubmit={submitProfile}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="mentor">Mentor</option>
                                    <option value="mentee">Mentee</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                                <select
                                    value={data.experience_level}
                                    onChange={e => setData('experience_level', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="junior">Junior</option>
                                    <option value="mid">Mid-level</option>
                                    <option value="senior">Senior</option>
                                    <option value="executive">Executive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    value={data.industry}
                                    onChange={e => setData('industry', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Function/Role</label>
                                <input
                                    type="text"
                                    value={data.function}
                                    onChange={e => setData('function', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                rows={4}
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                Active user
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            {/* Additional Information */}
            <div className="space-y-6">
                {/* Mentor Capacity (if user is a mentor) */}
                {(user.role === 'mentor' || user.role === 'both') && (
                    <Card>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Mentor Capacity</h2>
                        <form onSubmit={submitCapacity}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Mentees</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={capacityData.max_mentees}
                                        onChange={e => setCapacityData('max_mentees', parseInt(e.target.value))}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Availability Status</label>
                                    <select
                                        value={capacityData.availability_status}
                                        onChange={e => setCapacityData('availability_status', e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="available">Available</option>
                                        <option value="limited">Limited</option>
                                        <option value="full">Full</option>
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit">
                                        Update Capacity
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Skills */}
                <Card>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Skills & Expertise</h2>
                    {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    {skill.name}
                                    {skill.pivot?.is_primary === 1 && (
                                        <span className="ml-1 text-xs">⭐</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                    )}
                </Card>

                {/* Goals (if user is a mentee) */}
                {(user.role === 'mentee' || user.role === 'both') && (
                    <Card>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h2>
                        {user.goals && user.goals.length > 0 ? (
                            <div className="space-y-3">
                                {user.goals.map((goal) => (
                                    <div key={goal.id} className="border-l-4 border-indigo-500 pl-4 py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{goal.skill?.name}</p>
                                                <p className="text-sm text-gray-600">Priority: {goal.priority}</p>
                                                {goal.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No goals set yet.</p>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}

interface MatchesTabProps {
    user: User;
    matches: MentorshipMatch[];
}

function MatchesTab({ user, matches }: MatchesTabProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { data, setData, post, submit, processing, errors, reset } = useForm({
        mentor_id: user.role === 'mentor' ? user.id : '',
        mentee_id: user.role === 'mentee' ? user.id : '',
        status: 'pending',
    });

    const submitCreateMatch = (e: React.FormEvent) => {
        e.preventDefault();

        submit(create(), {
            onSuccess: () => {
                setShowCreateForm(false);
                reset();
            }
        })
        // post(route('admin.matches.create'), {
        //     onSuccess: () => {
        //         setShowCreateForm(false);
        //         reset();
        //     }
        // });
    };

    const getOtherUser = (match: MentorshipMatch) => {
        return match.mentor_id === user.id ? match.mentee : match.mentor;
    };

    const getMatchType = (match: MentorshipMatch) => {
        return match.mentor_id === user.id ? 'Mentoring' : 'Being Mentored';
    };

    return (
        <div className="space-y-6">
            {/* Create Match Form */}
            {showCreateForm && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Create New Match</h3>
                        <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                            Cancel
                        </Button>
                    </div>
                    <form onSubmit={submitCreateMatch}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mentor</label>
                                <input
                                    type="text"
                                    value={user.role === 'mentor' ? user.name : ''}
                                    disabled
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                                />
                                <input type="hidden" name="mentor_id" value={data.mentor_id} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mentee</label>
                                <input
                                    type="text"
                                    value={user.role === 'mentee' ? user.name : ''}
                                    disabled
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                                />
                                <input type="hidden" name="mentee_id" value={data.mentee_id} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Match'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                    Mentorship Matches ({matches.length})
                </h2>
                <Button onClick={() => setShowCreateForm(true)}>
                    Create New Match
                </Button>
            </div>

            {/* Matches List */}
            {matches.length === 0 ? (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500">No mentorship matches found.</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {matches.map((match) => (
                        <MatchCard key={match.id} match={match} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface MatchCardProps {
    match: MentorshipMatch;
    user: User;
}

function MatchCard({ match, user }: MatchCardProps) {
    const { post } = useForm();

    const getOtherUser = (match: MentorshipMatch) => {
        return match.mentor_id === user.id ? match.mentee : match.mentor;
    };

    const getMatchType = (match: MentorshipMatch) => {
        return match.mentor_id === user.id ? 'Mentoring' : 'Being Mentored';
    };

    const updateStatus = (newStatus: string) => {
        // post(route('admin.matches.status.update', { match: match.id }), {
        //     status: newStatus
        // });
        router.post(updateMatchStatus(match.id).url, { status: newStatus })
    };

    const deleteMatch = () => {
        if (confirm('Are you sure you want to delete this match?')) {
            // post(route('admin.matches.delete', { match: match.id }));
            router.delete(deleteMethod(match.id).url);
            // post(route('admin.matches.delete', { match: match.id }));
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            discontinued: 'bg-red-100 text-red-800',
            on_hold: 'bg-gray-100 text-gray-800',
        };
        return colors[status as keyof typeof colors] || colors.pending;
    };

    const otherUser = getOtherUser(match);

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            {otherUser?.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {match.status}
                        </span>
                        <span className="text-sm text-gray-500">
                            {getMatchType(match)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Compatibility:</span> {match.compatibility_score}%
                        </div>
                        <div>
                            <span className="font-medium">Matched:</span> {match.matched_at ? new Date(match.matched_at).toLocaleDateString() : 'Not started'}
                        </div>
                        <div>
                            <span className="font-medium">Created:</span> {new Date(match.created_at).toLocaleDateString()}
                        </div>
                        {match.completed_at && (
                            <div>
                                <span className="font-medium">Completed:</span> {new Date(match.completed_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {otherUser && (
                        <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Contact:</span> {otherUser.email}
                            {otherUser.industry && ` • ${otherUser.industry}`}
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                    {/* Status Update Buttons */}
                    {match.status === 'pending' && (
                        <Button onClick={() => updateStatus('active')} size="sm">
                            Activate
                        </Button>
                    )}
                    {match.status === 'active' && (
                        <>
                            <Button onClick={() => updateStatus('completed')} size="sm" variant="secondary">
                                Complete
                            </Button>
                            <Button onClick={() => updateStatus('on_hold')} size="sm" variant="secondary">
                                Pause
                            </Button>
                        </>
                    )}
                    {(match.status === 'on_hold' || match.status === 'completed') && (
                        <Button onClick={() => updateStatus('active')} size="sm">
                            Reactivate
                        </Button>
                    )}
                    <Button onClick={deleteMatch} size="sm" variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    );
}

interface SuggestionsTabProps {
    user: User;
    suggestions: MatchSuggestion[];
}

function SuggestionsTab({ user, suggestions }: SuggestionsTabProps) {
    const { post, } = useForm();

    const createMatch = (suggestedUser: any) => {
        const data = {
            mentor_id: user.role === 'mentor' ? user.id : suggestedUser.id,
            mentee_id: user.role === 'mentee' ? user.id : suggestedUser.id,
            status: 'pending'
        };

        // post(route('admin.matches.create'), { ...data });
        // post(create().url, { ...data });
        router.post(create().url, { ...data })
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Suggested Matches ({suggestions.length})
                </h2>
                <p className="text-gray-600">
                    These are potential matches based on the user's profile and our matching algorithm.
                </p>
            </div>

            {suggestions.length === 0 ? (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-500">No suggested matches at this time.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestions.map((suggestion, index) => (
                        <Card key={index}>
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{suggestion.user.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {suggestion.user.industry} • {suggestion.user.experience_level}
                                    </p>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">Compatibility</span>
                                            <span className="text-sm font-bold text-green-600">{suggestion.compatibility_score.toFixed(2)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${suggestion.compatibility_score}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {suggestion.match_reasons.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Match Reasons</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {suggestion.match_reasons.map((reason, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="text-green-500 mr-2">✓</span>
                                                        {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-4">
                                    <Button
                                        onClick={() => createMatch(suggestion.user)}
                                        className="w-full"
                                    >
                                        Create Match
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}