# EduCore

Sistema de gestão escolar desenvolvido para web, estruturado com interface interativa, camada de **back-end** e integração com **Firebase** para autenticação e persistência de dados. O projeto simula fluxos reais de uma instituição de ensino com diferentes níveis de acesso.

## Arquitetura e Tecnologias

* **Front-end**: HTML5 semântico, CSS3 (layouts responsivos, transições e animações, incluindo componente visual estilo *Matrix*) e JavaScript modular (`ES Modules`).
* **Back-end**: Camada de regras de negócio e comunicação de dados *(ex.: API/serviços em Node.js ou Python — ajuste conforme a sua implementação)*.
* **Firebase**: Integração para fluxos de autenticação e armazenamento/sincronização de dados da aplicação (`./js/auth.js` e módulos do painel).

## Principais Funcionalidades

* **Autenticação e Cadastro (`index.html` / `estilo.css`)**: Interface com alternância animada entre login e criação de conta, seleção de perfil (*Aluno*, *Professor*, *Responsável*) e integração com o fluxo de autenticação.
* **Painel Escolar Multoperfil (`inicio.html` / `inicio.css`)**: Navegação lateral e seletor de perfil ativo (*Administrador*, *Professor*, *Aluno*, *Responsável*).
* **Gestão de Usuários e Acessos**: Cadastro, edição e listagem de usuários (*Aluno*, *Professor*, *Funcionário*) com controle de ações na interface.
* **Controle de Notas e Frequências**: Lançamento de notas (0 a 10) e faltas por disciplina (*Matemática*, *Português*, *Back-End*) com visualização em boletim.
* **Gestão Financeira**: Geração de mensalidades (mês de referência, valor e vencimento) e acompanhamento em relatório financeiro.
* **Componente Visual Matrix (`fundo.html` / `fundo.css`)**: Animação em CSS com colunas de caracteres e adaptação para telas menores.

## Estrutura do Projeto

* `index.html` e `estilo.css` — Tela de login e cadastro com transição entre painéis.
* `inicio.html` e `inicio.css` — Painel principal de gestão escolar, acadêmica e financeira.
* `fundo.html` e `fundo.css` — Efeito visual animado estilo Matrix.
* `js/script.js` — Controle de interações de interface na tela de acesso.
* `js/auth.js` — Integração de autenticação e sessão.
* `js/inicio.js` — Lógica dos módulos do painel escolar e comunicação com back-end/Firebase.

## Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
