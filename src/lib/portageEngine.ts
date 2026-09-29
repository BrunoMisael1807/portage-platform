import { differenceInMonths } from 'date-fns';

export const PONTOS = {
  SIM: 1.0,
  AV: 0.5,
  NAO: 0.0,
} as const;

export interface ItemAvaliacao {
  id: string;
  foi_avaliado: boolean;
  pontuacao: typeof PONTOS[keyof typeof PONTOS];
}

export interface FaixaEtaria {
  idade_min_meses: number;
  idade_max_meses: number;
  idade_referencia_meses: number;
  total_itens: number;
  itens: ItemAvaliacao[];
}

export interface AvaliacaoPortage {
  cognicao: FaixaEtaria[];
  motor: FaixaEtaria[];
  linguagem: FaixaEtaria[];
  socializacao: FaixaEtaria[];
  autocuidado: FaixaEtaria[];
}

export function calcularIdadeDesenvolvimentoArea(faixasArea: FaixaEtaria[]): number {
  if (!faixasArea || !Array.isArray(faixasArea)) {
    return 0;
  }

  const listaProporcoes: number[] = [];
  const listaIdadesReferencia: number[] = [];

  for (const faixa of faixasArea) {
    let pontosObtidos = 0;
    let itensAvaliados = 0;

    if (faixa.itens && Array.isArray(faixa.itens)) {
      for (const item of faixa.itens) {
        if (item.foi_avaliado) {
          pontosObtidos += item.pontuacao;
          itensAvaliados += 1;
        }
      }
    }

    if (itensAvaliados > 0) {
      const pontosMaximosAvaliados = itensAvaliados * PONTOS.SIM;
      const proporcao = pontosObtidos / pontosMaximosAvaliados;
      listaProporcoes.push(proporcao);
      listaIdadesReferencia.push(faixa.idade_referencia_meses);
    }
  }

  if (listaProporcoes.length === 0) return 0;

  let somaPesos = 0;
  let somaPonderada = 0;

  for (let i = 0; i < listaProporcoes.length; i++) {
    somaPonderada += listaIdadesReferencia[i] * listaProporcoes[i];
    somaPesos += listaProporcoes[i];
  }

  return somaPesos === 0 ? 0 : somaPonderada / somaPesos; 
}

export function formatarIdade(mesesTotais: number): string {
  const mesesArredondados = Math.round(mesesTotais);
  const anos = Math.floor(mesesArredondados / 12);
  const meses = mesesArredondados % 12;

  if (anos === 0) return `${meses} meses`;
  if (meses === 0) return anos === 1 ? '1 ano' : `${anos} anos`;
  return `${anos} anos e ${meses} meses`;
}

export function calcularIdadeCronologica(dataNascimento: string | Date, dataAvaliacao: string | Date = new Date()): number {
  return differenceInMonths(new Date(dataAvaliacao), new Date(dataNascimento));
}

export function gerarRelatorioAvaliacao(dataNascimento: string, avaliacaoDB: Record<string, any>) {
  const idadeCronologicaMeses = calcularIdadeCronologica(dataNascimento);
  const areas = ['cognicao', 'motor', 'linguagem', 'socializacao', 'autocuidado'] as const;
  
  const resultadosPorArea = areas.map((area) => {
    const idadeDesenvolvimento = calcularIdadeDesenvolvimentoArea(avaliacaoDB[area]);
    const atraso = idadeCronologicaMeses - idadeDesenvolvimento;
    
    return {
      area,
      idadeDesenvolvimentoMeses: idadeDesenvolvimento,
      idadeFormatada: formatarIdade(idadeDesenvolvimento),
      atrasoMeses: atraso,
      temAtraso: atraso > 0
    };
  });

  const idadeGeralDesenvolvimento = resultadosPorArea.reduce((acc, curr) => acc + curr.idadeDesenvolvimentoMeses, 0) / areas.length;
  
  const quocienteDesenvolvimento = idadeCronologicaMeses > 0 
    ? (idadeGeralDesenvolvimento / idadeCronologicaMeses) * 100 
    : 100;

  return {
    idadeCronologicaMeses,
    idadeCronologicaFormatada: formatarIdade(idadeCronologicaMeses),
    idadeGeralDesenvolvimento,
    quocienteDesenvolvimento: Math.round(quocienteDesenvolvimento),
    detalhesPorArea: resultadosPorArea
  };
}