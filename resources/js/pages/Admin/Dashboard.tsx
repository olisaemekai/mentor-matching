// resources/js/Pages/Admin/Dashboard.tsx
import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import { PageProps, AdminMetrics, AlgorithmWeights, MentorshipMatch } from '../../types';
import { algorithmWeights } from '@/routes/admin';

interface AdminDashboardProps {
    metrics: AdminMetrics;
    recentMatches: MentorshipMatch[];
}

export default function AdminDashboard() {
    const { metrics, recentMatches } = usePage<PageProps<AdminDashboardProps>>().props;

    const { data, setData, post, submit, processing, errors } = useForm<{
        weights: AlgorithmWeights;
    }>({
        weights: {
            skills: 0.40,
            experience: 0.20,
            industry: 0.15,
            communication: 0.10,
            timezone: 0.10,
            availability: 0.05
        }
    });

    const submitWeights = (e: React.FormEvent) => {
        e.preventDefault();
        submit(algorithmWeights());
    };

    const updateWeight = (key: keyof AlgorithmWeights, value: number) => {
        setData('weights', {
            ...data.weights,
            [key]: value
        });
    };

    const totalWeight = Object.values(data.weights).reduce((sum, weight) => sum + weight, 0);
    const isWeightValid = Math.abs(totalWeight - 1.0) < 0.01;

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Monitor and manage the mentorship platform</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                    <MetricCard title="Total Users" value={metrics.totalUsers} />
                    <MetricCard title="Active Mentors" value={metrics.activeMentors} />
                    <MetricCard title="Active Mentees" value={metrics.activeMentees} />
                    <MetricCard title="Active Matches" value={metrics.activeMatches} />
                    <MetricCard title="Pending Matches" value={metrics.pendingMatches} />
                    <MetricCard title="Completed" value={metrics.completedMatches} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Algorithm Weights */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Matching Algorithm Weights</h2>
                        <form onSubmit={submitWeights}>
                            <div className="space-y-4">
                                {(Object.keys(data.weights) as Array<keyof AlgorithmWeights>).map((key) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                            {key.replace('_', ' ')} ({(data.weights[key] * 100).toFixed(0)}%)
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={data.weights[key]}
                                            onChange={e => updateWeight(key, parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className={`text-sm ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
                                    Total Weight: {(totalWeight * 100).toFixed(1)}%
                                    {!isWeightValid && ' - Weights must sum to 100%'}
                                </p>
                            </div>

                            <div className="mt-6">
                                <Button type="submit" disabled={processing || !isWeightValid}>
                                    {processing ? 'Updating...' : 'Update Weights'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Recent Matches */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
                        <div className="space-y-4">
                            {recentMatches.map((match) => (
                                <div key={match.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {match.mentor?.name} ↔ {match.mentee?.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Score: {match.compatibility_score}% •
                                                Status: <span className={`capitalize ${match.status === 'active' ? 'text-green-600' :
                                                    match.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                                                    }`}>
                                                    {match.status}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(match.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

interface MetricCardProps {
    title: string;
    value: number;
}

function MetricCard({ title, value }: MetricCardProps) {
    return (
        <Card>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{value}</p>
        </Card>
    );
}