# Decisões de Arquitetura

## ADR-001 — Licença do software

**Status:** Aprovado  
**Data:** 16/09/2026

### Decisão

Adotar **AGPL-3.0** para o código-fonte do projeto.

### Motivo

O projeto deseja ser open source e estimular contribuições externas, mantendo obrigações de compartilhamento do código de versões modificadas usadas como serviço de rede, conforme a licença.

### Consequência

Não criar uma regra de licença que proíba comercialização do software.

Qualquer política econômica deverá ser tratada separadamente da licença.

---

## ADR-002 — Plataforma gratuita

**Status:** Aprovado

### Decisão

O objetivo do projeto é oferecer a plataforma oficial gratuitamente ao usuário final sempre que a infraestrutura permitir.

### Consequência

Custos de infraestrutura não serão confundidos com preço de licença do software.

Serviços como hospedagem, implantação, suporte e manutenção podem ser tratados separadamente.

---

## ADR-003 — Dados clínicos não são públicos

**Status:** Aprovado

### Decisão

Nenhum dado clínico será acessível sem autenticação e autorização.

### Consequência

Não existirão:

- endpoints públicos para prontuários;
- buckets públicos para documentos;
- páginas indexáveis com dados de pacientes;
- acesso anônimo a avaliações.

---

## ADR-004 — RLS

**Status:** Aprovado

### Decisão

Utilizar Row-Level Security no PostgreSQL/Supabase.

### Regra

O controle de acesso deverá permanecer válido mesmo que alguém tente acessar a API sem utilizar a interface normal.

### Consequência

As políticas devem ser testadas automaticamente.

---

## ADR-005 — Separação do motor Portage

**Status:** Aprovado

### Decisão

A lógica do protocolo será implementada em módulo de domínio independente da UI.

### Consequência

Será possível testar o algoritmo sem navegador e sem depender dos componentes visuais.

---

## ADR-006 — Protocolo versionado

**Status:** Aprovado

### Decisão

Cada avaliação deverá registrar explicitamente qual versão do protocolo foi utilizada.

### Consequência

Alterações futuras no instrumento não deverão modificar silenciosamente avaliações antigas.

---

## ADR-007 — IA no desenvolvimento

**Status:** Aprovado

### Decisão

Ferramentas de IA, incluindo Google AI/Gemini, poderão ser utilizadas para:

- documentação;
- código;
- testes;
- revisão;
- dados sintéticos.

### Restrição

Dados pessoais e clínicos reais não serão enviados às ferramentas de IA utilizadas no desenvolvimento.

---

## ADR-008 — IA clínica

**Status:** Adiado

### Decisão

A primeira versão não terá IA clínica.

### Motivo

Funções de análise clínica exigem avaliação independente de:

- privacidade;
- segurança;
- fornecedor;
- finalidade;
- base legal;
- supervisão profissional;
- riscos;
- contrato e condições do serviço.

### Consequência

A arquitetura deverá permitir futura integração sem tornar a IA uma dependência do MVP.

---

## ADR-009 — Armazenamento de arquivos

**Status:** Aprovado para MVP

### Decisão

Usar armazenamento privado.

### Regras

- buckets privados;
- controle de acesso por política;
- URLs temporárias;
- auditoria;
- validação de tipo e tamanho;
- nenhuma URL pública permanente para documento clínico.

---

## ADR-010 — Dados reais em desenvolvimento

**Status:** Aprovado

### Decisão

Ambientes de desenvolvimento e testes utilizarão apenas dados fictícios.

### Consequência

Criar fixtures sintéticas para:

- pacientes;
- profissionais;
- avaliações;
- relatórios;
- compartilhamentos.

---

## ADR-011 — GitHub

**Status:** Aprovado

### Decisão

Manter o código público em repositório GitHub.

### Regras

- branch principal protegida;
- Pull Request;
- revisão;
- CI;
- SECURITY.md;
- CONTRIBUTING.md;
- proibição de dados reais no repositório.

---

## ADR-012 — Sequência de desenvolvimento

**Status:** Aprovado

### Ordem

```text
1. Governança e requisitos
2. Licença e conteúdo
3. LGPD e segurança
4. Repositório
5. Infraestrutura
6. Autenticação
7. Pacientes
8. Compartilhamento
9. Motor de avaliação
10. Interface de avaliação
11. Histórico
12. Relatórios
13. Dashboard
14. Segurança final
15. Produção
16. IA clínica (futuro)
```

---

## ADR-013 — Contradições do requisito do protocolo

**Status:** Bloqueado para decisão

### Problemas registrados

1. O documento declara 580 itens.
2. As quantidades por área listadas somam 535.
3. A regra `AV = 0,5` entra em tensão com a regra especial de faixa composta apenas por `AV`.

### Decisão

Não resolver essas contradições por inferência.

A equipe deverá solicitar/confirmar a versão oficial antes de implementar o comportamento definitivo.

---

## ADR-014 — Stack inicial

**Status:** Aprovado para MVP

### Decisão

Adotar como base:

- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Zod;
- React Hook Form;
- TanStack Query;
- PostgreSQL/Supabase;
- Supabase Auth;
- Supabase Storage;
- GitHub Actions.

### Observação

Prisma será usado apenas se sua adoção não entrar em conflito com a estratégia de RLS e autorização.

---

## Registro de mudanças

| Data | ADR | Alteração |
|---|---|---|
| 16/09/2026 | ADR-001 a ADR-014 | Criação da arquitetura inicial |
