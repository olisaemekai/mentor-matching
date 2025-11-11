// resources/js/Pages/Profile/Edit.tsx
import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Card from '../../Components/UI/Card';
import Button from '../../Components/UI/Button';
import { PageProps, User, Skill } from '../../types';
import { update } from '@/routes/user-profile';


// Wayfinder route helper
const route = (name: string, params: any = {}) => {
    return (window as any).wayfinder(name, params);
};

interface ProfileFormData {
    name: string;
    bio: string;
    industry: string;
    function: string;
    experience_level: string;
    communication_style: string;
    time_zone: string;
    skills: Array<{
        id: number;
        name: string;
        proficiency: number;
        is_primary: boolean;
    }>;
    goals: Array<{
        skill_id: number;
        priority: number;
        description: string;
        target_date: string;
        status: string;
        progress_notes?: string;
    }>;
}

interface EditProfileProps {
    user: User;
    skills: Skill[];
}

export default function EditNew() {
    const { user, skills } = usePage<PageProps<EditProfileProps>>().props;

    console.log(user)

    const { data, setData, submit, processing, errors } = useForm<ProfileFormData>({
        name: user.name || '',
        bio: user.bio || '',
        industry: user.industry || '',
        function: user.function || '',
        experience_level: user.experience_level || 'junior',
        communication_style: user.communication_style || '',
        time_zone: user.time_zone || '',
        skills: user.skills?.map(skill => ({
            id: skill.id,
            name: skill.name,
            proficiency: skill.pivot?.proficiency || 3,
            is_primary: skill.pivot?.is_primary || false
        })) || [],
        goals: user.goals?.map(goal => ({
            skill_id: goal.skill_id,
            priority: goal.priority,
            description: goal.description || '',
            target_date: goal.target_date || '',
            status: goal.status || 'active',
            progress_notes: goal.progress_notes || ''
        })) || [],
    });

    const [newSkill, setNewSkill] = useState({
        skill_id: '',
        proficiency: 3,
        is_primary: false
    });


    const [newGoal, setNewGoal] = useState({
        skill_id: '',
        priority: 1,
        description: '',
        target_date: '',
        status: 'active' as 'active' | 'completed' | 'abandoned',
        progress_notes: ''
    });

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        // put(route('profile.update'));
        submit(update());
    };

    const addSkill = () => {
        if (newSkill.skill_id) {
            const skill = skills.find(s => s.id === parseInt(newSkill.skill_id));
            if (skill) {
                setData('skills', [...data.skills, {
                    ...newSkill,
                    id: skill.id,
                    name: skill.name
                }]);
                setNewSkill({ skill_id: '', proficiency: 3, is_primary: false });
            }
        }
    };

    const removeSkill = (index: number) => {
        const updatedSkills = [...data.skills];
        updatedSkills.splice(index, 1);
        setData('skills', updatedSkills);
    };

    const addGoal = () => {
        if (newGoal.skill_id) {
            const skill = skills.find(s => s.id === parseInt(newGoal.skill_id));
            if (skill) {
                setData('goals', [...data.goals, {
                    ...newGoal,
                    skill_id: skill.id
                }]);
                setNewGoal({
                    skill_id: '',
                    priority: 1,
                    description: '',
                    target_date: '',
                    status: 'active',
                    progress_notes: ''
                });
            }
        }
    };

    const removeGoal = (index: number) => {
        const updatedGoals = [...data.goals];
        updatedGoals.splice(index, 1);
        setData('goals', updatedGoals);
    };

    const updateGoal = (index: number, field: string, value: any) => {
        const updatedGoals = [...data.goals];
        updatedGoals[index] = { ...updatedGoals[index], [field]: value };
        setData('goals', updatedGoals);
    };

    const proficiencyLabels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

    const priorityLabels = ['High Priority', 'Medium Priority', 'Low Priority'];
    const statusLabels = {
        active: 'Active',
        completed: 'Completed',
        abandoned: 'Abandoned'
    };

    const statusColors = {
        active: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        abandoned: 'bg-red-100 text-red-800'
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600">Update your profile information to get better matches</p>
                </div>

                <form onSubmit={submitForm}>
                    {/* ... (Basic Information and Skills sections remain the same) ... */}

                    {/* Basic Information */}
                    <Card className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                                    Experience Level
                                </label>
                                <select
                                    id="experience_level"
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

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    id="industry"
                                    value={data.industry}
                                    onChange={e => setData('industry', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="function" className="block text-sm font-medium text-gray-700">
                                    Function/Role
                                </label>
                                <input
                                    type="text"
                                    id="function"
                                    value={data.function}
                                    onChange={e => setData('function', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="communication_style" className="block text-sm font-medium text-gray-700">
                                    Communication Style
                                </label>
                                <select
                                    id="communication_style"
                                    value={data.communication_style}
                                    onChange={e => setData('communication_style', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select a style</option>
                                    <option value="direct">Direct</option>
                                    <option value="supportive">Supportive</option>
                                    <option value="structured">Structured</option>
                                    <option value="flexible">Flexible</option>
                                    <option value="casual">Casual</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="time_zone" className="block text-sm font-medium text-gray-700">
                                    Time Zone
                                </label>
                                <input
                                    type="text"
                                    id="time_zone"
                                    value={data.time_zone}
                                    onChange={e => setData('time_zone', e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                rows={4}
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </Card>

                    {/* Skills Section */}
                    <Card className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Skills & Expertise</h2>

                        {/* Add Skill Form */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <select
                                    value={newSkill.skill_id}
                                    onChange={e => setNewSkill({ ...newSkill, skill_id: e.target.value })}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select a skill</option>
                                    {skills.map(skill => (
                                        <option key={skill.id} value={skill.id}>
                                            {skill.name} ({skill.category})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    value={newSkill.proficiency}
                                    onChange={e => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <option key={level} value={level}>
                                            {proficiencyLabels[level - 1]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={newSkill.is_primary}
                                        onChange={e => setNewSkill({ ...newSkill, is_primary: e.target.checked })}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Primary</span>
                                </label>
                                <Button type="button" onClick={addSkill} className="ml-4">
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* Skills List */}
                        <div className="space-y-2">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border rounded">
                                    <div>
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="ml-2 text-sm text-gray-600">
                                            ({proficiencyLabels[skill.proficiency - 1]})
                                            {skill.is_primary && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    Primary
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Enhanced Goals Section (for mentees) */}
                    {user.role === 'mentee' && (
                        <Card className="mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h2>

                            {/* Add Goal Form */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <h3 className="text-md font-medium text-gray-900 mb-3">Add New Goal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Skill to Learn</label>
                                        <select
                                            value={newGoal.skill_id}
                                            onChange={e => setNewGoal({ ...newGoal, skill_id: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select a skill</option>
                                            {skills.map(skill => (
                                                <option key={skill.id} value={skill.id}>
                                                    {skill.name} ({skill.category})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                                        <select
                                            value={newGoal.priority}
                                            onChange={e => setNewGoal({ ...newGoal, priority: parseInt(e.target.value) })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {[1, 2, 3].map(priority => (
                                                <option key={priority} value={priority}>
                                                    {priorityLabels[priority - 1]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                        <input
                                            type="date"
                                            value={newGoal.target_date}
                                            onChange={e => setNewGoal({ ...newGoal, target_date: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={newGoal.status}
                                            onChange={e => setNewGoal({ ...newGoal, status: e.target.value as any })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="abandoned">Abandoned</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Goal Description</label>
                                    <input
                                        type="text"
                                        value={newGoal.description}
                                        onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Describe what you want to achieve..."
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Progress Notes (Optional)</label>
                                    <textarea
                                        rows={2}
                                        value={newGoal.progress_notes}
                                        onChange={e => setNewGoal({ ...newGoal, progress_notes: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Any notes about your progress..."
                                    />
                                </div>

                                <Button type="button" onClick={addGoal}>
                                    Add Goal
                                </Button>
                            </div>

                            {/* Goals List */}
                            <div className="space-y-4">
                                {data.goals.map((goal, index) => {
                                    const skill = skills.find(s => s.id === goal.skill_id);
                                    const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && goal.status === 'active';

                                    return (
                                        <div key={index} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h4 className="font-medium text-gray-900">{skill?.name}</h4>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[goal.status as keyof typeof statusColors]}`}>
                                                            {statusLabels[goal.status as keyof typeof statusLabels]}
                                                        </span>
                                                        {isOverdue && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                Overdue
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                                                        <div>
                                                            <span className="font-medium">Priority:</span> {priorityLabels[goal.priority - 1]}
                                                        </div>
                                                        {goal.target_date && (
                                                            <div>
                                                                <span className="font-medium">Target Date:</span> {new Date(goal.target_date).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {goal.description && (
                                                        <p className="text-sm text-gray-700 mb-2">{goal.description}</p>
                                                    )}

                                                    {goal.progress_notes && (
                                                        <div className="bg-blue-50 p-3 rounded mt-2">
                                                            <p className="text-sm font-medium text-blue-800 mb-1">Progress Notes:</p>
                                                            <p className="text-sm text-blue-700">{goal.progress_notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGoal(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Goal Management Controls */}
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="flex flex-wrap gap-2">
                                                    <select
                                                        value={goal.status}
                                                        onChange={e => updateGoal(index, 'status', e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="active">Set Active</option>
                                                        <option value="completed">Mark Completed</option>
                                                        <option value="abandoned">Mark Abandoned</option>
                                                    </select>

                                                    <input
                                                        type="date"
                                                        value={goal.target_date}
                                                        onChange={e => updateGoal(index, 'target_date', e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Add progress notes..."
                                                        value={goal.progress_notes || ''}
                                                        onChange={e => updateGoal(index, 'progress_notes', e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 min-w-0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {data.goals.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No goals added yet. Add your first learning goal above.</p>
                            )}
                        </Card>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}