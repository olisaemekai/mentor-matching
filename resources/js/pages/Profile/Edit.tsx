// resources/js/Pages/Profile/Edit.tsx
import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PageProps, User, Skill } from '../../types';
import { update } from '@/routes/user-profile';

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
    }>;
}

interface EditProfileProps {
    user: User;
    skills: Skill[];
}

export default function Edit() {
    const { user, skills } = usePage<PageProps<EditProfileProps>>().props;

    const { data, setData, put, submit, processing, errors } = useForm<ProfileFormData>({
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
            description: goal.description || ''
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
        description: ''
    });

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        submit(update());
        // put(route('profile.update'));
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
                setNewGoal({ skill_id: '', priority: 1, description: '' });
            }
        }
    };

    const removeGoal = (index: number) => {
        const updatedGoals = [...data.goals];
        updatedGoals.splice(index, 1);
        setData('goals', updatedGoals);
    };

    const proficiencyLabels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
    const priorityLabels = ['High Priority', 'Medium Priority', 'Low Priority'];

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-600">Update your profile information to get better matches</p>
                </div>

                <form onSubmit={submitForm}>
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

                    {/* Goals Section (for mentees) */}
                    {user.role === 'mentee' && (
                        <Card className="mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h2>

                            {/* Add Goal Form */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <select
                                        value={newGoal.skill_id}
                                        onChange={e => setNewGoal({ ...newGoal, skill_id: e.target.value })}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select a goal</option>
                                        {skills.map(skill => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.name} ({skill.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={newGoal.priority}
                                        onChange={e => setNewGoal({ ...newGoal, priority: parseInt(e.target.value) })}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {[1, 2, 3].map(priority => (
                                            <option key={priority} value={priority}>
                                                {priorityLabels[priority - 1]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Button type="button" onClick={addGoal}>
                                        Add Goal
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="goal-description" className="block text-sm font-medium text-gray-700">
                                    Goal Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="goal-description"
                                    value={newGoal.description}
                                    onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Describe what you want to achieve..."
                                />
                            </div>

                            {/* Goals List */}
                            <div className="space-y-2">
                                {data.goals.map((goal, index) => {
                                    const skill = skills.find(s => s.id === goal.skill_id);
                                    return (
                                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                                            <div>
                                                <span className="font-medium">{skill?.name}</span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({priorityLabels[goal.priority - 1]})
                                                </span>
                                                {goal.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeGoal(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
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