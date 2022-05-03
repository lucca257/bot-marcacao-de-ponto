const fs = require('fs');

class Logger {
    escreverLog(content){
        const CAMINHO_ARQUIVO_LOG = './ponto.log'
        const data_atual = this._obterDataAtual()
        const texto = `\r\n ${data_atual}: solicitação de ponto marcada no dia ${content.data} nos horários: ${content.horario_entrada} ${content.horario_entrada_intervalo} ${content.horario_saido_intervalo} ${content.horario_saida}.`
        
        fs.writeFile(CAMINHO_ARQUIVO_LOG, texto, { flag: 'a+' }, err => {
            if (err) {
              console.error(err);
            }
            return console.log(123);  
          });
    }

    //private functions
    _obterDataAtual(){
        const data = new Date();
        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0');
        let ano = data.getFullYear();
        return dia + '/' + mes + '/' + ano;
    }
}

module.exports = Logger