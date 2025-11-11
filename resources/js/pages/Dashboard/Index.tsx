// resources/js/Pages/Dashboard/Index.tsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, User, MatchSuggestion, MentorshipMatch } from '../../types';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { accept, activities, complete, decline, request } from '@/routes/matches';

interface DashboardProps {
    user: User;
    suggestedMentors?: MatchSuggestion[];
    suggestedMentees?: MatchSuggestion[];
    activeMatches?: MentorshipMatch[];
    pendingRequests?: MentorshipMatch[];
}

export default function Dashboard() {
    const { user, data, suggestedMentors = [], suggestedMentees = [], activeMatches = [], pendingRequests = [] } = usePage<PageProps<DashboardProps>>().props;


    // console.log(activeMatches)
    const isMentee = user.role === 'mentee';
    const isMentor = user.role === 'mentor';

    return (
        <AppLayout>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Here's your mentorship dashboard</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h3 className="text-lg font-medium text-gray-900">Active Matches</h3>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{activeMatches.length}</p>
                </Card>
                {isMentor && (
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                        <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
                    </Card>
                )}
                <Card>
                    <h3 className="text-lg font-medium text-gray-900">Suggested Matches</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {isMentee ? suggestedMentors.length : suggestedMentees.length}
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Suggested Matches */}
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {isMentee ? 'Suggested Mentors' : 'Suggested Mentees'}
                        </h2>
                        <Link href="/matches">
                            <Button>View All</Button>
                        </Link>
                    </div>

                    {isMentee ? (
                        <SuggestedMentorsList mentors={suggestedMentors} />
                    ) : (
                        <SuggestedMenteesList mentees={suggestedMentees} />
                    )}
                </Card>

                {/* Active Matches */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Active Mentorships</h2>
                    <ActiveMatchesList matches={activeMatches} isMentor={isMentor} />
                </Card>

                {/* Pending Requests (Mentors only) */}
                {isMentor && pendingRequests.length > 0 && (
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Match Requests</h2>
                        <PendingRequestsList requests={pendingRequests} />
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

interface SuggestedMentorsListProps {
    mentors: MatchSuggestion[];
}

function SuggestedMentorsList({ mentors }: SuggestedMentorsListProps) {
    if (mentors.length === 0) {
        return <p className="text-gray-500">No suggested mentors at the moment.</p>;
    }

    return (
        <div className="space-y-4">
            {mentors.map((match, index) => (
                <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900">{match.user.name}</h3>
                            <p className="text-sm text-gray-600">{match.user.industry} • {match.user.experience_level}</p>
                            <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {match.compatibility_score.toFixed(2)}% match
                                </span>
                            </div>
                            {match.match_reasons.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-600">
                                    {match.match_reasons.map((reason, i) => (
                                        <li key={i}>• {reason}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Link
                            href={request(match.user.id).url}
                            // href={route('matches.request', { user: match.user.id })}
                            method="post"
                            as="button"
                        >
                            <Button>Request Match</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface SuggestedMenteesListProps {
    mentees: MatchSuggestion[];
}

function SuggestedMenteesList({ mentees }: SuggestedMenteesListProps) {
    if (mentees.length === 0) {
        return <p className="text-gray-500">No suggested mentees at the moment.</p>;
    }

    return (
        <div className="space-y-4">
            {mentees.map((match, index) => (
                <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium text-gray-900">{match.user.name}</h3>
                            <p className="text-sm text-gray-600">{match.user.industry} • {match.user.experience_level}</p>
                            <div className="flex items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {match.compatibility_score.toFixed(2)}% match
                                </span>
                            </div>
                            {match.match_reasons.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-600">
                                    {match.match_reasons.map((reason, i) => (
                                        <li key={i}>• {reason}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Link
                            href={request(match.user.id).url}
                            // href={route('matches.request', { user: match.user.id })}
                            method="post"
                            as="button"
                        >
                            <Button>Request Match</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface ActiveMatchesListProps {
    matches: MentorshipMatch[];
    isMentor: boolean;
}

function ActiveMatchesList({ matches, isMentor }: ActiveMatchesListProps) {
    if (matches.length === 0) {
        return <p className="text-gray-500">No active mentorships.</p>;
    }

    return (
        <div className="space-y-4">
            {matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <Link href={activities(match.id)}>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {isMentor ? match.mentee?.name : match.mentor?.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Matched on {new Date(match.matched_at!).toLocaleDateString()}
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={complete(match.id).url}
                            // href={route('matches.complete', { match: match.id })}
                            method="post"
                            as="button"
                        >
                            <Button>Complete</Button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface PendingRequestsListProps {
    requests: MentorshipMatch[];
}

function PendingRequestsList({ requests }: PendingRequestsListProps) {
    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-gray-900">{request.mentee?.name}</h3>
                            <p className="text-sm text-gray-600">
                                Compatibility: {request.compatibility_score}%
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Link
                                href={accept(request.id).url}
                                // href={route('matches.accept', { match: request.id })}
                                method="post"
                                as="button"
                            >
                                <Button>Accept</Button>
                            </Link>
                            <Link
                                href={decline(request.id).url}
                                // href={route('matches.decline', { match: request.id })}
                                method="post"
                                as="button"
                            >
                                <Button variant="secondary">Decline</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}