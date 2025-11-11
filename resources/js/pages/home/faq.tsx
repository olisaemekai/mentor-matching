import React from 'react'

const faqs = [
    {
        id: 1,
        question: 'What is MentorConnect?',
        answer:
            'MentorConnect is a professional platform that connects mentors and mentees to learn, grow, and achieve goals together through guided mentorship sessions and a supportive community.',
    },
    {
        id: 2,
        question: 'How do I become a mentor?',
        answer:
            'To become a mentor, simply create a MentorConnect account, complete your mentor profile with your expertise and interests, and start connecting with mentees who need your guidance.',
    },
    {
        id: 3,
        question: 'Is MentorConnect free to use?',
        answer:
            'Yes! You can sign up and connect with mentors for free. Some mentors may also offer paid structured programs or professional consultations.',
    },
    {
        id: 4,
        question: 'How are mentors and mentees matched?',
        answer:
            'MentorConnect matches mentors and mentees based on shared goals, skills, and interests. You can also browse profiles and request mentorship manually.',
    },
    {
        id: 5,
        question: 'Can I be both a mentor and a mentee?',
        answer:
            'Absolutely! Many users mentor in their field of expertise while also learning from others in areas they wish to grow. MentorConnect supports both roles in one account.',
    },
    {
        id: 6,
        question: 'Is my data safe on MentorConnect?',
        answer:
            'Yes. MentorConnect uses modern encryption and secure authentication to ensure your information and communications are always protected.',
    },
]

export default function FAQs() {
    return (
        <div className="mx-auto max-w-2xl px-6 pb-8 sm:pt-12 sm:pb-24 lg:max-w-7xl lg:px-8 lg:pb-32">
            <h2 className="text-center text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Frequently asked questions
            </h2>
            <dl className="mt-20 divide-y divide-gray-900/10 dark:divide-white/10">
                {faqs.map((faq) => (
                    <div key={faq.id} className="py-8 first:pt-0 last:pb-0 lg:grid lg:grid-cols-12 lg:gap-8">
                        <dt className="text-base/7 font-semibold text-gray-900 lg:col-span-5 dark:text-white">
                            {faq.question}
                        </dt>
                        <dd className="mt-4 lg:col-span-7 lg:mt-0">
                            <p className="text-base/7 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

