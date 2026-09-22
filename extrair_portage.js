const fs = require('fs');
const xlsx = require('xlsx');

// Nome exato da sua planilha
const filePath = 'Planilha_Portage automatizada Para o Sistema.xlsx';
const workbook = xlsx.readFile(filePath);

const validSheets = ['SOCIALIZAÇÃO', 'LINGUAGEM', 'AUTOS CUIDADOS', 'COGNIÇÃO', 'MOTOR'];
const sheetPrefixes = { 'SOCIALIZAÇÃO': 'soc', 'LINGUAGEM': 'lin', 'AUTOS CUIDADOS': 'aut', 'COGNIÇÃO': 'cog', 'MOTOR': 'mot' };
const sheetNamesMap = { 'SOCIALIZAÇÃO': 'Socialização', 'LINGUAGEM': 'Linguagem', 'AUTOS CUIDADOS': 'Autocuidados', 'COGNIÇÃO': 'Cognição', 'MOTOR': 'Desenvolvimento Motor' };

const portageAreas = [];
let totalItems = 0;

validSheets.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return;

  // range: 3 ignora as primeiras linhas de cabeçalho e começa na linha certa
  const data = xlsx.utils.sheet_to_json(sheet, { range: 3, defval: "" });
  const items = [];
  
  data.forEach(row => {
    // Apanha as colunas (mesmo que tenham espaços ocultos vindos do Excel)
    const numRaw = row['N.º '] || row['N.º'];
    const perguntaRaw = row['Verificar se: '] || row['Verificar se:'];
    const criterioRaw = row['Critério'];
    const idadeRaw = row['Idade'];

    if (perguntaRaw && typeof numRaw === 'number') {
      // Converte "5 a 6" no número 5 para o motor clínico
      let faixa = 0;
      if (idadeRaw && typeof idadeRaw === 'string') {
        faixa = parseInt(idadeRaw.split(' ')[0], 10);
      }

      items.push({
        id: `${sheetPrefixes[sheetName]}_${numRaw}`,
        numero: numRaw,
        faixa_etaria: isNaN(faixa) ? 0 : faixa,
        pergunta: perguntaRaw.toString().trim(),
        criterio: criterioRaw ? criterioRaw.toString().trim() : ""
      });
    }
  });

  portageAreas.push({
    area: sheetNamesMap[sheetName],
    items: items
  });
  totalItems += items.length;
});

// Prepara o conteúdo a ser gravado num novo ficheiro
const tsContent = `// Ficheiro gerado automaticamente a partir da Planilha Portage
// Total de itens extraídos: ${totalItems}

export const portageAreas = ${JSON.stringify(portageAreas, null, 2)};
`;

// Cria a pasta src/data se não existir
if (!fs.existsSync('./src/data')) {
  fs.mkdirSync('./src/data', { recursive: true });
}

// Grava o ficheiro final
fs.writeFileSync('./src/data/portage.ts', tsContent, 'utf8');
console.log(`✅ Extração concluída com sucesso! ${totalItems} itens guardados em src/data/portage.ts`);