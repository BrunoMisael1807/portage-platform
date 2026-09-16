# Validação do Protocolo Portage / IPO

## 1\. Objetivo

Este documento registra as informações necessárias para validar o conteúdo e as regras do instrumento antes de transformá-los em lógica definitiva de software.

## 2\. Informação fornecida pelo projeto

O requisito original informa:

* 580 itens;
* cinco áreas;
* faixa etária de 0 a 6 anos;
* respostas `S`, `AV` e `N`;
* regras de pontuação e progressão;
* armazenamento do histórico;
* aplicação dinâmica por faixa etária.

O documento original também recomenda que o protocolo seja versionado e que exista uma estrutura específica para áreas, faixas e itens.

## 3\. Áreas informadas

Conforme o material de requisitos:

|Área|Quantidade informada|
|-|-:|
|Cognição|108|
|Linguagem|99|
|Socialização|83|
|Desenvolvimento Motor|140|
|Autocuidados|105|
|**Total**|**535**|

### Observação crítica

A soma das quantidades informadas na documentação é **535**, enquanto o requisito declara **580 itens**.

Portanto, existe uma inconsistência documental que deve ser resolvida **antes da carga definitiva do protocolo**.

Esta divergência não deverá ser corrigida por suposição da equipe de desenvolvimento.

## 4\. Faixas etárias informadas

O requisito apresenta:

* 0–1 ano
* 1–2 anos
* 2–3 anos
* 3–4 anos
* 4–5 anos
* 5–6 anos

Essas faixas devem ser verificadas contra a fonte/versão oficial do instrumento antes de serem consideradas a estrutura definitiva.

## 5\. Regras de resposta informadas

O documento original define:

```text
S  = 1 ponto
AV = 0,5 ponto
N  = 0 ponto
```

Essas regras devem ser confirmadas contra a versão do instrumento adotada.

## 6\. Regras de aplicação informadas

O material também descreve:

* início em faixa relacionada à idade cronológica;
* progressão;
* retrocesso;
* encerramento por sequência de respostas;
* cálculo por área;
* cálculo geral.

A documentação técnica deve transformar essas regras em uma especificação formal e testável.

## 7\. Contradição de pontuação

O requisito estabelece `AV = 0,5`, mas também apresenta uma regra especial segundo a qual uma faixa composta apenas por `AV` teria pontuação igual a zero.

Essa situação deve ser esclarecida pela fonte oficial antes da implementação.

## 8\. Regra de engenharia

O conteúdo clínico/protocolar nunca deverá ser espalhado pelo frontend.

Implementar um módulo independente:

```text
src/domain/portage/
├── engine.ts
├── scoring.ts
├── progression.ts
├── validation.ts
├── types.ts
└── rules.ts
```

A interface apenas apresenta o resultado do motor.

## 9\. Versionamento

Cada versão do protocolo deverá possuir:

* identificador;
* versão;
* data de vigência;
* origem;
* observações;
* status;
* hash dos dados importados, quando aplicável.

Uma avaliação já finalizada deverá continuar vinculada à versão do protocolo utilizada no momento da aplicação.

## 10\. Importação

A carga definitiva deve ser feita por migration/seed versionado.

Não editar os itens manualmente no banco de produção.

Fluxo:

```text
Fonte autorizada
      ↓
Arquivo estruturado
      ↓
Validação automática
      ↓
Revisão humana
      ↓
Seed/migration
      ↓
Ambiente de testes
      ↓
Homologação
      ↓
Produção
```

## 11\. Testes obrigatórios

Criar testes para:

* pontuação de cada resposta;
* soma por área;
* cálculo geral;
* primeira faixa;
* progressão;
* retrocesso;
* encerramento;
* faixa sem respostas;
* respostas incompletas;
* casos de fronteira;
* mudança de versão;
* retomada de avaliação.

## 12\. Critério de homologação

O protocolo somente será considerado homologado quando:

* \[ ] quantidade total de itens confirmada;
* \[ ] quantidade por área confirmada;
* \[ ] faixas etárias confirmadas;
* \[ ] descrições confirmadas;
* \[ ] critérios confirmados;
* \[ ] regras de aplicação confirmadas;
* \[ ] regras de pontuação confirmadas;
* \[ ] regras de progressão confirmadas;
* \[ ] regras de retrocesso confirmadas;
* \[ ] regras de encerramento confirmadas;
* \[ ] licença/autorização documental arquivada;
* \[ ] seeds revisados;
* \[ ] testes aprovados;
* \[ ] validação funcional realizada.

## 13\. Conteúdo do manual

O manual possui direitos autorais conforme a informação fornecida pelo responsável do projeto.

A aplicação e reprodução de fichas foram informadas como livres de replicação.

O projeto, entretanto, deverá manter separado:

* o manual;
* o conteúdo necessário à aplicação;
* as fichas;
* a documentação produzida pela equipe;
* o código-fonte.

Não publicar o manual completo no repositório sem autorização específica para esse tipo de redistribuição.

## 14\. Decisão atual

**Status:** NÃO HOMOLOGADO.

O desenvolvimento poderá criar o modelo de dados e um motor genérico parametrizado, mas os itens e regras definitivos só deverão ser importados depois que as inconsistências e condições de uso estiverem documentalmente resolvidas.

