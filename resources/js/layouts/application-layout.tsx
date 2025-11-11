import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    CloudArrowUpIcon,
    FingerPrintIcon,
    LockClosedIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import Header from '@/pages/home/header'
import Footer from '@/pages/home/footer'
import { Toaster } from '@/components/ui/sonner'





function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="bg-white dark:bg-gray-900">
            <Toaster position='top-right' richColors />
            {/* Header */}
            <div>
                <Header />
            </div>

            {/* Main content */}
            <div>
                {children}
            </div>

            {/* Footer */}
            <div>
                <Footer />
            </div>
        </div>
    )
}
