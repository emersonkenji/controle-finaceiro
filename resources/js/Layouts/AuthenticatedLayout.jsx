import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

export default function Authenticated({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={header} />

            <div className="flex h-screen">
                <Sidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={user} />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                        <div className="container mx-auto px-6 py-8">
                            {header && (
                                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                                    {header}
                                </h1>
                            )}
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
