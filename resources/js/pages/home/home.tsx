import AppLayout from '@/layouts/app-layout'
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout'
import ApplicationLayout from '@/layouts/application-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react'
import Features from './features';
import FAQs from './faq';
import CTA from './cta';
import Hero from './hero';


// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Profile settings',
//         href: '',
//     },
// ];



const Home = () => {
    return (
        <ApplicationLayout>
            <main className="isolate">
                {/* Hero section */}
                <Hero />

                {/* Features */}
                <div className='mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8'>
                    <Features />
                </div>

                {/* FAQs */}
                <div>
                    <FAQs />
                </div>


                {/* CTA section */}
                <div>
                    <CTA />
                </div>
            </main>
        </ApplicationLayout>
    )
}

export default Home