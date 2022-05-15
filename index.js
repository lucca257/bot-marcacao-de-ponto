const marcar = require('./src/marcar-ponto');
const login = require('./config');
const readline = require('readline');
const Logger = require('./src/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const logger = new Logger();

function question(theQuestion) {
  return new Promise(resolve => rl.question(theQuestion, answ => resolve(answ)))
}

function prepareDataFromString(strData){
  let [ano, mes, dia] = strData.split('-');
  return new Date(ano, mes-1, dia);
}

async function askQuestions(){
  const data = new Date();
  let dia = String(data.getDate()).padStart(2, '0');
  let mes = String(data.getMonth() + 1).padStart(2, '0');
  let ano = data.getFullYear();
  var dados_ponto = {
    horario_entrada : "09:00",
    horario_entrada_intervalo : "12:00",
    horario_saido_intervalo : "13:00",
    horario_saida : "18:00",
    data : dia + '/' + mes + '/' + ano,
  }

  let answer = await question("deseja marcar ponto padrao? (s/n):  ")
  if(answer !== 's') {
    dados_ponto.data = await question("qual data deseja marcar ? (dd/mm/aaaa):  ");
    answer = await question("horario padrao? (s/n):  ")
    if (answer !== 's') {
      dados_ponto.horario_entrada = await question("horario I:  ");
      dados_ponto.horario_entrada_intervalo = await question("horario II:  ");
      dados_ponto.horario_saido_intervalo = await question("horario III:  ");
      dados_ponto.horario_saida = await question("horario IV:  ");
    }
    console.log("dados do ponto: ", dados_ponto);
    answer = await question("os horarios estao corretos ? (s/n):  ")
    if (answer !== 's') {
      rl.close();
      return;
    }
  }

  let dateInterval = await question("Quais dias deseja marcar? (Y-m-d~Y-m-d):")
  let [strIni, strFim] = dateInterval.split('~');
  let dataAtualDeMarcacao = prepareDataFromString(strIni);
  dataAtualDeMarcacao.setDate(dataAtualDeMarcacao.getDate()-1)

  while (dataAtualDeMarcacao < prepareDataFromString(strFim)) {
    dataAtualDeMarcacao.setDate(dataAtualDeMarcacao.getDate()+1);
    if ([0,6].indexOf(dataAtualDeMarcacao.getDay()) != -1) {
      continue;
    }
    dia = String(dataAtualDeMarcacao.getDate()).padStart(2, '0');
    mes = String(dataAtualDeMarcacao.getMonth() + 1).padStart(2, '0');
    ano = dataAtualDeMarcacao.getFullYear();
    dados_ponto.data = dia + '/' + mes + '/' + ano;
    console.log("Marcando ponto("+dados_ponto.data+")...");
    await marcar({
      ...dados_ponto,
      ...login
    }).then(() => {
      logger.escreverLog(dados_ponto)
      console.log("ponto marcado com sucesso!");
    });
    
  }
}

(async () => {
  await askQuestions();
})();