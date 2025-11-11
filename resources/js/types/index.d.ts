import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    role: 'mentor' | 'mentee' | 'both';
    bio?: string;
    industry?: string;
    function?: string;
    experience_level: 'junior' | 'mid' | 'senior' | 'executive';
    communication_style?: 'direct' | 'supportive' | 'structured' | 'flexible' | 'casual';
    time_zone?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    skills?: Skill[];
    goals?: MenteeGoal[];
    mentor_capacity?: MentorCapacity;

    // Methods that Laravel may provide via accessors
    isMentee?: boolean;
    isMentor?: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Skill {
    id: number;
    name: string;
    category: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        proficiency: number;
        is_primary: boolean;
    };
}

export interface MenteeGoal {
    id: number;
    mentee_id: number;
    skill_id: number;
    priority: number;
    description?: string;
    created_at: string;
    updated_at: string;
    skill?: Skill;
}

export interface MentorCapacity {
    id: number;
    mentor_id: number;
    max_mentees: number;
    current_mentees: number;
    availability_status: 'available' | 'limited' | 'full';
    created_at: string;
    updated_at: string;
}

export interface MentorshipMatch {
    id: number;
    mentor_id: number;
    mentee_id: number;
    compatibility_score: number;
    status: 'pending' | 'active' | 'on_hold' | 'completed' | 'discontinued';
    matched_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    mentor?: User;
    mentee?: User;
}

export interface MatchSuggestion {
    user: User;
    compatibility_score: number;
    match_reasons: string[];
}

export interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

export interface AdminMetrics {
    totalUsers: number;
    activeMentors: number;
    activeMentees: number;
    activeMatches: number;
    pendingMatches: number;
    completedMatches: number;
}

export interface AlgorithmWeights {
    skills: number;
    experience: number;
    industry: number;
    communication: number;
    timezone: number;
    availability: number;
}