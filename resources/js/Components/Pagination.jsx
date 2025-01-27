import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
  } from "@components/ui/pagination";

// import { Pagination } from "./ui/pagination";

  export default function PaginationComponent({ links }) {
    // Filtrando links para exibir os itens válidos
    const filteredLinks = links.filter(link => link.url !== null);

    return (
      <Pagination>
        <PaginationContent>
          {/* "Anterior" */}
          {filteredLinks[0] && (
            <PaginationItem>
              <PaginationPrevious href={filteredLinks[0].url} isActive={filteredLinks[0].active}>
                {filteredLinks[0].label}
              </PaginationPrevious>
            </PaginationItem>
          )}

          {/* Paginação com número de páginas */}
          {filteredLinks.slice(1, -1).map((link, index) => (
            <PaginationItem key={index}>
              <PaginationLink href={link.url} isActive={link.active}>
                {link.label}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* "Próximo" */}
          {filteredLinks[filteredLinks.length - 1] && (
            <PaginationItem>
              <PaginationNext href={filteredLinks[filteredLinks.length - 1].url} isActive={filteredLinks[filteredLinks.length - 1].active}>
                {filteredLinks[filteredLinks.length - 1].label}
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  }
