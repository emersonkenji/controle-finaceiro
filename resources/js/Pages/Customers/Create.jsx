import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Form from './Form';

export default function Create({ auth }) {
    return (
        // <AuthenticatedLayout
        //         user={auth.user}
        //         header="Novo Cliente"
        //     >
        //      <Head title="Novo Cliente" />

            //  <div className="py-12">
            //      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            //          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            //              <div className="p-6">
                             <Form />
            //              </div>
            //          </div>
            //      </div>
            //  </div>
        // </AuthenticatedLayout>
    );
}
