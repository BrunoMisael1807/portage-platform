# Base Legal e Privacidade

## 1. Objetivo

Este documento estabelece os requisitos iniciais de privacidade e proteção de dados para a Plataforma Web de Avaliação Portage.

Ele é um documento de engenharia e governança inicial e **não substitui avaliação jurídica**.

## 2. Natureza dos dados

A aplicação poderá tratar:

- dados cadastrais;
- dados de identificação;
- dados de contato;
- dados de profissionais;
- dados de crianças;
- dados de responsáveis;
- informações relacionadas a avaliações;
- informações clínicas e de desenvolvimento;
- documentos e anexos.

O sistema deverá considerar que informações de saúde são dados pessoais sensíveis e que dados de crianças exigem proteção reforçada.

## 3. Princípio de acesso

A plataforma não terá prontuários acessíveis publicamente.

O acesso a dados pessoais e clínicos exigirá:

1. autenticação;
2. autorização;
3. relação válida com o registro;
4. aplicação do princípio do menor privilégio;
5. auditoria de operações relevantes.

## 4. Crianças e responsáveis

O sistema deverá possuir fluxo específico para consentimento e/ou outra base legal aplicável a cada finalidade.

Quando houver tratamento baseado em consentimento relacionado a criança, o processo deverá registrar de maneira verificável:

- responsável legal;
- versão do termo;
- texto/identificador do termo;
- data e hora;
- evidência do aceite;
- situação do consentimento;
- revogação, quando ocorrer;
- informação necessária para auditoria.

O processo jurídico deverá ser validado antes da produção.

## 5. Finalidades

As finalidades deverão ser cadastradas e documentadas antes da coleta.

Exemplos:

- criação e manutenção do cadastro;
- realização da avaliação;
- manutenção do histórico;
- geração de relatórios;
- compartilhamento autorizado;
- segurança;
- auditoria;
- atendimento de obrigações legais ou regulatórias.

A aplicação deverá evitar coletar dados sem finalidade definida.

## 6. Minimização

Somente deverão ser coletados os dados necessários para as finalidades aprovadas.

A equipe deve evitar:

- campos sem uso;
- observações livres excessivamente abrangentes;
- cópia desnecessária de documentos;
- duplicação desnecessária de dados sensíveis.

## 7. Controle de acesso

### Profissional

Acesso somente aos pacientes e registros autorizados.

### Administrador

Acesso administrativo conforme necessidade e políticas internas, com autenticação forte e auditoria.

### Auditor

Acesso aos registros de auditoria necessários para investigação, sem permissão para alterar dados clínicos.

## 8. RLS

O banco deverá utilizar Row-Level Security para impedir acesso indevido entre profissionais e organizações.

Nenhuma proteção deverá depender somente da interface.

Toda operação sensível deverá ser validada também no servidor e/ou banco.

## 9. Compartilhamento

O compartilhamento entre profissionais deverá ser explícito.

Registrar:

- quem compartilhou;
- com quem;
- paciente;
- escopo da permissão;
- data;
- status;
- revogação.

## 10. Auditoria

Eventos relevantes deverão ser auditados.

Exemplos:

- autenticação;
- alterações de permissão;
- criação de paciente;
- alteração de paciente;
- compartilhamento;
- revogação;
- criação de avaliação;
- finalização;
- geração de relatório;
- download de documento;
- operações administrativas.

Os logs não deverão armazenar senhas, tokens ou dados clínicos desnecessários.

## 11. Retenção

A aplicação não deverá assumir um prazo único para todos os registros.

Criar uma política de retenção por categoria de dado, levando em conta:

- finalidade;
- hipótese legal;
- obrigação de conservação;
- categoria profissional;
- regulamentação aplicável;
- encerramento do atendimento;
- necessidade de defesa de direitos;
- ordem legal ou judicial.

## 12. Exclusão e soft delete

“Excluir” na interface não significa necessariamente apagar imediatamente o dado físico.

O sistema deverá distinguir:

- desativação;
- soft delete;
- eliminação definitiva;
- anonimização;
- retenção por obrigação legal;
- bloqueio por investigação ou preservação.

## 13. Solicitações de titulares

Criar fluxo de privacidade para registrar:

- solicitação;
- identificação;
- data;
- categoria do pedido;
- análise;
- resultado;
- comunicação;
- evidências.

## 14. RIPD e registros de tratamento

Antes da produção, deverão ser preparados, conforme aplicabilidade:

- registro das operações de tratamento;
- avaliação de riscos;
- RIPD;
- mapa de fluxo de dados;
- matriz de fornecedores;
- plano de resposta a incidentes.

## 15. Fornecedores

Antes de utilizar fornecedor externo com dados reais, documentar:

- função do fornecedor;
- tipos de dados compartilhados;
- finalidade;
- localização;
- medidas de segurança;
- retenção;
- suboperadores;
- contrato/termos aplicáveis;
- procedimento em caso de incidente.

## 16. Inteligência artificial

### Regra para desenvolvimento

IA poderá ser usada para:

- documentação;
- geração de código;
- revisão de código;
- testes;
- exemplos;
- dados fictícios.

### Proibição

Não inserir em ferramentas de IA de desenvolvimento:

- nome real de criança;
- CPF;
- endereço;
- diagnóstico;
- prontuário;
- relatório clínico;
- foto;
- dados reais de responsáveis.

### IA clínica

Qualquer funcionalidade que processe dados clínicos deverá ser submetida a uma revisão específica de:

- privacidade;
- segurança;
- fornecedor;
- contratos;
- finalidade;
- base legal;
- transparência;
- riscos;
- supervisão profissional.

A primeira versão do produto deverá funcionar sem IA clínica.

## 17. Incidentes

Criar procedimento para:

1. identificação;
2. contenção;
3. preservação de evidências;
4. análise;
5. correção;
6. avaliação de impacto;
7. comunicação interna;
8. comunicação externa quando aplicável;
9. registro;
10. prevenção de recorrência.

## 18. Checklist antes de produção

- [ ] Controlador definido
- [ ] Operadores definidos
- [ ] Responsabilidades definidas
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Registro de tratamento
- [ ] RIPD, quando aplicável
- [ ] Política de retenção
- [ ] Fluxo de direitos do titular
- [ ] Fluxo de incidentes
- [ ] RLS testado
- [ ] Logs testados
- [ ] Fornecedores avaliados
- [ ] Segurança revisada
