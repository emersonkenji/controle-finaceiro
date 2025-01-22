import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Pagination({ links }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
                {links.prev && (
                    <Link href={links.prev}>
                        <Button variant="outline" size="sm">
                            Anterior
                        </Button>
                    </Link>
                )}
                {links.next && (
                    <Link href={links.next}>
                        <Button variant="outline" size="sm">
                            Próximo
                        </Button>
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">{links.from}</span>{' '}
                        até{' '}
                        <span className="font-medium">{links.to}</span>{' '}
                        de{' '}
                        <span className="font-medium">{links.total}</span>{' '}
                        resultados
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
                        {links.links.map((link, index) => {
                            if (link.url === null) {
                                return (
                                    <span
                                        key={index}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                                    >
                                        {link.label === '&laquo; Previous' ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : link.label === 'Next &raquo;' ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            link.label
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active
                                            ? 'z-10 bg-primary text-white border-primary'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                                    }`}
                                >
                                    {link.label === '&laquo; Previous' ? (
                                        <ChevronLeft className="h-4 w-4" />
                                    ) : link.label === 'Next &raquo;' ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        link.label
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
