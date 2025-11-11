// resources/js/Pages/Matches/Activities.tsx
import React, { useState } from 'react';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import { PageProps, MentorshipMatch, User, MenteeGoal } from '../../types';
import { dashboard } from '@/routes';
import { edit } from '@/routes/user-profile';
import { update } from '@/routes/goals';

// Wayfinder route helper
// const route = (name: string, params: any = {}) => {
//     return (window as any).wayfinder(name, params);
// };

interface ActivitiesProps {
    match: MentorshipMatch & {
        mentor: User;
        mentee: User;
        mentee_goals?: (MenteeGoal & { skill: any })[];
    };
}

export default function Activities() {
    const { match } = usePage<PageProps<ActivitiesProps>>().props;
    const { auth } = usePage<PageProps>().props;

    console.log(match)

    const [activeTab, setActiveTab] = useState<'goals' | 'sessions' | 'notes'>('goals');
    const { data, setData, post, processing, errors } = useForm({
        content: '',
        type: 'note' as 'note' | 'milestone'
    });

    const isMentor = auth.user.id === match.mentor_id;
    const otherUser = isMentor ? match.mentee : match.mentor;

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        // This would connect to your sessions/notes functionality
        // For now, we'll just show the form structure
        console.log('Submitting note:', data);
        setData('content', '');
    };

    const getGoalStatusColor = (status: string, targetDate?: string) => {
        const isOverdue = targetDate && new Date(targetDate) < new Date() && status === 'active';

        if (isOverdue) return 'bg-orange-100 text-orange-800';

        return {
            active: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            abandoned: 'bg-red-100 text-red-800'
        }[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link href={dashboard()} className="text-indigo-600 hover:text-indigo-900 mb-2 inline-block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Mentorship with {otherUser.name}
                            </h1>
                            <p className="text-gray-600">
                                Compatibility: {match.compatibility_score}% •
                                Started: {new Date(match.matched_at!).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="secondary" onClick={() => window.print()}>
                                Print Summary
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Active Goals"
                        value={match.mentee_goals?.filter(g => g.status === 'active').length || 0}
                    />
                    <StatCard
                        title="Completed Goals"
                        value={match.mentee_goals?.filter(g => g.status === 'completed').length || 0}
                        color="green"
                    />
                    <StatCard
                        title="Overdue Goals"
                        value={match.mentee_goals?.filter(g =>
                            g.status === 'active' && g.target_date && new Date(g.target_date) < new Date()
                        ).length || 0}
                        color="orange"
                    />
                    <StatCard
                        title="Match Duration"
                        value={Math.ceil((new Date().getTime() - new Date(match.matched_at!).getTime()) / (1000 * 60 * 60 * 24)) + ' days'}
                        color="blue"
                    />
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <TabButton
                            active={activeTab === 'goals'}
                            onClick={() => setActiveTab('goals')}
                        >
                            Learning Goals ({match.mentee.goals?.length || 0})
                        </TabButton>
                        <TabButton
                            active={activeTab === 'sessions'}
                            onClick={() => setActiveTab('sessions')}
                        >
                            Sessions & Meetings
                        </TabButton>
                        <TabButton
                            active={activeTab === 'notes'}
                            onClick={() => setActiveTab('notes')}
                        >
                            Progress Notes
                        </TabButton>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'goals' && <GoalsTab match={match} isMentor={isMentor} />}
                {activeTab === 'sessions' && <SessionsTab match={match} isMentor={isMentor} />}
                {activeTab === 'notes' && <NotesTab match={match} isMentor={isMentor} />}
            </div>
        </AppLayout>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    color?: 'blue' | 'green' | 'orange' | 'red';
}

function StatCard({ title, value, color = 'blue' }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        orange: 'bg-orange-50 text-orange-700',
        red: 'bg-red-50 text-red-700'
    };

    return (
        <Card className={`text-center ${colorClasses[color]}`}>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-2 text-2xl font-bold">{value}</p>
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

interface GoalsTabProps {
    match: ActivitiesProps['match'];
    isMentor: boolean;
}

function GoalsTab({ match, isMentor }: GoalsTabProps) {
    const { post } = useForm();

    const updateGoalStatus = (goalId: number, status: string) => {
        // post(route('goals.update', { goal: goalId }), { status });
        router.post(update(goalId).url, { status })
    };

    const addProgressNote = (goalId: number, notes: string) => {
        // post(route('goals.update', { goal: goalId }), { progress_notes: notes });
        router.post(update(goalId).url, { progress_notes: notes })

    };

    const goalsByStatus = {
        active: match.mentee?.goals?.filter(g => g.status === 'active') || [],
        completed: match.mentee?.goals?.filter(g => g.status === 'completed') || [],
        abandoned: match.mentee?.goals?.filter(g => g.status === 'abandoned') || []
    };

    return (
        <div className="space-y-6">
            {/* Goal Summary */}
            <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Goals Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{goalsByStatus.active.length}</div>
                        <div className="text-sm text-blue-600">Active Goals</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{goalsByStatus.completed.length}</div>
                        <div className="text-sm text-green-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">
                            {goalsByStatus.active.filter(g => g.target_date && new Date(g.target_date) < new Date()).length}
                        </div>
                        <div className="text-sm text-orange-600">Overdue</div>
                    </div>
                </div>
            </Card>

            {/* Active Goals */}
            <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Active Goals</h2>
                {goalsByStatus.active.length === 0 ? (
                    <Card>
                        <div className="text-center py-8">
                            <p className="text-gray-500">No active goals. Add goals to your profile to track your progress.</p>
                            <Link href={edit()} className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                                Add Goals to Profile
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {goalsByStatus.active.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                isMentor={isMentor}
                                onStatusChange={updateGoalStatus}
                                onNotesUpdate={addProgressNote}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Goals */}
            {goalsByStatus.completed.length > 0 && (
                <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Completed Goals</h2>
                    <div className="space-y-4">
                        {goalsByStatus.completed.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                isMentor={isMentor}
                                onStatusChange={updateGoalStatus}
                                onNotesUpdate={addProgressNote}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface GoalCardProps {
    goal: MenteeGoal & { skill: any };
    isMentor: boolean;
    onStatusChange: (goalId: number, status: string) => void;
    onNotesUpdate: (goalId: number, notes: string) => void;
}

function GoalCard({ goal, isMentor, onStatusChange, onNotesUpdate }: GoalCardProps) {
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState(goal.progress_notes || '');
    const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && goal.status === 'active';

    const statusColors = {
        active: isOverdue ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        abandoned: 'bg-red-100 text-red-800'
    };

    const handleSaveNotes = () => {
        onNotesUpdate(goal.id, notes);
        setShowNotes(false);
    };

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{goal.skill.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[goal.status as keyof typeof statusColors]}`}>
                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                            {isOverdue && ' (Overdue)'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                            <span className="font-medium">Priority:</span> {goal.priority}
                        </div>
                        {goal.target_date && (
                            <div>
                                <span className="font-medium">Target Date:</span> {new Date(goal.target_date).toLocaleDateString()}
                            </div>
                        )}
                    </div>

                    {goal.description && (
                        <p className="text-sm text-gray-700 mb-3">{goal.description}</p>
                    )}

                    {goal.progress_notes && (
                        <div className="bg-blue-50 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-blue-800 mb-1">Progress Notes:</p>
                            <p className="text-sm text-blue-700">{goal.progress_notes}</p>
                        </div>
                    )}

                    {/* Progress Notes Toggle */}
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        {showNotes ? 'Cancel' : goal.progress_notes ? 'Edit Notes' : 'Add Progress Notes'}
                    </button>

                    {showNotes && (
                        <div className="mt-3">
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add progress notes about this goal..."
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowNotes(false)}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveNotes}
                                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Controls */}
                {isMentor && (
                    <div className="ml-4 flex flex-col space-y-2">
                        {goal.status === 'active' && (
                            <>
                                <button
                                    onClick={() => onStatusChange(goal.id, 'completed')}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Mark Complete
                                </button>
                                <button
                                    onClick={() => onStatusChange(goal.id, 'abandoned')}
                                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Mark Abandoned
                                </button>
                            </>
                        )}
                        {goal.status !== 'active' && (
                            <button
                                onClick={() => onStatusChange(goal.id, 'active')}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Reactivate
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}

// Placeholder components for other tabs
function SessionsTab({ match, isMentor }: { match: any; isMentor: boolean }) {
    return (
        <Card>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sessions & Meetings</h2>
            <div className="text-center py-8">
                <p className="text-gray-500">Session tracking functionality coming soon.</p>
                <p className="text-sm text-gray-400 mt-2">
                    This section will allow you to schedule and track mentorship sessions,
                    take meeting notes, and set action items.
                </p>
            </div>
        </Card>
    );
}

function NotesTab({ match, isMentor }: { match: any; isMentor: boolean }) {
    const { data, setData, post, processing } = useForm({
        content: '',
        type: 'note' as 'note' | 'milestone'
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation for saving notes
        console.log('Saving note:', data);
        setData('content', '');
    };

    return (
        <div className="space-y-6">
            {/* Add Note Form */}
            <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add Progress Note</h2>
                <form onSubmit={submitNote}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Note Type</label>
                        <select
                            value={data.type}
                            onChange={e => setData('type', e.target.value as any)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="note">General Note</option>
                            <option value="milestone">Milestone Achievement</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            rows={4}
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Share updates, progress, or insights from your mentorship journey..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing || !data.content.trim()}>
                            {processing ? 'Saving...' : 'Save Note'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Notes List */}
            <Card>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Previous Notes</h2>
                <div className="text-center py-8">
                    <p className="text-gray-500">No notes yet. Add your first note above to track your progress.</p>
                </div>
            </Card>
        </div>
    );
}