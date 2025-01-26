import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function Pagination({ links, current_page, last_page }) {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(links[0].url)}
                    disabled={current_page === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </Button>

                {links.slice(1, -1).map((link, i) => (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(link.url)}
                    >
                        {link.label}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(links[links.length - 1].url)}
                    disabled={current_page === last_page}
                >
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
