// resources/js/Pages/Matches/Index.tsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import { PageProps, MatchSuggestion } from '../../types';
import { request } from '@/routes/matches';

interface MatchesProps {
    matches: MatchSuggestion[];
}

export default function Matches() {
    const { matches } = usePage<PageProps<MatchesProps>>().props;

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Find Matches</h1>
                    <p className="text-gray-600">Discover potential mentorship connections based on your profile</p>
                </div>

                {matches.length === 0 ? (
                    <Card>
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                            <p className="text-gray-600 mb-4">
                                Update your profile with more details to get better matches.
                            </p>
                            <Link href="/profile">
                                <Button>Update Profile</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match, index) => (
                            <MatchCard key={index} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

interface MatchCardProps {
    match: MatchSuggestion;
}

function MatchCard({ match }: MatchCardProps) {
    return (
        <Card>
            <div className="flex flex-col h-full">
                {/* User Info */}
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{match.user.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {match.user.industry} • {match.user.experience_level}
                    </p>

                    {match.user.bio && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{match.user.bio}</p>
                    )}

                    {/* Compatibility Score */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Compatibility</span>
                            <span className="text-sm font-bold text-green-600">{match.compatibility_score.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${match.compatibility_score}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Match Reasons */}
                    {match.match_reasons.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Why this match?</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                {match.match_reasons.map((reason, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Skills or Goals */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            {match.user.skills ? 'Skills' : 'Learning Goals'}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {(match.user.skills || match.user.goals)?.slice(0, 5).map((item, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {item.skill?.name || item.name}
                                </span>
                            ))}
                            {((match.user.skills && match.user.skills.length > 5) || (match.user.goals && match.user.goals.length > 5)) && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    +{Math.max(
                                        (match.user.skills?.length || 0) - 5,
                                        (match.user.goals?.length || 0) - 5
                                    )} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-4">
                    <Link
                        href={request(match.user.id).url}
                        // href={route('matches.request', { user: match.user.id })}
                        method="post"
                        as="button"
                        className="w-full"
                    >
                        <Button className="w-full">Request Match</Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}