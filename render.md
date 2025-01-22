# Sistema de Gestão Empresarial (ERP) - Especificação Técnica

## Stack Tecnológica
- Backend: Laravel 11+ com Breeze
- Frontend: Vite + TailwindCSS + shadcn/ui
- Database: Mariadb
- API: REST com Laravel Sanctum
- Inertia.js para SPA
- Autenticação: Laravel Breeze
- javascript jsx
- Pasta com iniciais maiusculas iguais a do projeto inicial
- nao use typescript

## Design System
### Tema
- Modo escuro e claro usando TailwindCSS
- Cores principais:
  - Fundo escuro: rgb(18, 18, 18)
  - Verde fluorescente: rgb(68, 255, 161) para acentos
  - Textos: rgb(240, 240, 240) no dark, rgb(18, 18, 18) no light
- Componentes shadcn/ui personalizados
- Layout responsivo mobile-first
- sidebar recolhivel com menu lateral

## Módulos do Sistema

### 1. Dashboard Principal
- KPIs principais em cards
- Gráficos usando Recharts:
  - Vendas diárias/mensais
  - Fluxo de caixa
  - Produtos mais vendidos
  - Performance de vendedores
- Alertas de estoque baixo
- Pedidos pendentes
- Entregas em andamento

### 2. Gestão de Clientes
- Cadastro completo com:
  - Dados pessoais (nome, sobrenome, email, CPF)
  - Múltiplos telefones
  - Integração ViaCEP para endereços
  - Categorização de clientes
  - Histórico de compras
  - Limite de crédito
  - Score interno
- Segmentação de clientes
- Sistema de fidelidade
- Histórico de interações

### 3. Produtos
- Cadastro com:
  - Nome e slug automático
  - SKU geração automática
  - Produtos simples/variáveis
  - Múltiplas imagens
  - Categorias e subcategorias
  - Controle de estoque
  - Preços (custo, venda, promocional)
  - Dimensões e peso
  - Códigos de barras
- Gestão de variações
- Controle de lote/validade
- Histórico de preços

### 4. Vendas
- PDV integrado
- Múltiplas formas de pagamento
- Taxas de cartão configuráveis
- Descontos por tipo de pagamento
- Comissões
- Orçamentos
- Vendas parceladas
- NFe integrada

### 5. Financeiro
- Contas a pagar/receber
- Fluxo de caixa
- DRE automático
- Centro de custos
- Conciliação bancária
- Gestão de taxas
- Relatórios fiscais

### 6. Funcionários
- Cadastro completo
- Controle de acesso por perfil
- Metas e comissões
- Ponto eletrônico
- Gestão de documentos
- Férias e ausências

### 7. Logística
- Gestão de entregas
- Roteirização
- Custos de frete
- Rastreamento
- Zonas de entrega
- Comissões entregadores

### 8. Relatórios
- Geração em PDF/Excel
- Relatórios personalizáveis
- Dashboards por setor
- Análises comparativas
- Projeções e tendências

### 9. Configurações
- Perfis de acesso
- Parâmetros do sistema
- Backup automático
- Logs de atividades
- Integrações (APIs)

## Funcionalidades Adicionais
- PWA para acesso mobile
- Notificações push
- Chat interno
- Calendário de eventos
- Gestão de documentos
- API completa para integrações
- Export/Import de dados

## Segurança
- Autenticação 2FA
- Logs de atividades
- Backup automático
- Criptografia de dados sensíveis
- Controle de sessões

## Interface
- Menu lateral colapsável
- Breadcrumbs
- Pesquisa global
- Atalhos de teclado
- Filtros avançados
- Ordenação customizável
- Temas personalizáveis
