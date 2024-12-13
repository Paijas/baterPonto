// // Função para calcular a diferença em horas e minutos entre dois horários
// function calcularDiferencaHoras(hora1, hora2) {
//     const diffMs = hora2 - hora1;  // Diferença em milissegundos
//     const diffHoras = diffMs / (1000 * 60 * 60);  // Convertendo para horas
//     const horas = Math.floor(diffHoras);  // Hora inteira
//     const minutos = Math.round((diffHoras - horas) * 60);  // Minutos restantes
//     return { horas, minutos };
// }

// // Função principal para calcular as horas trabalhadas
// function calcularHorasTrabalhadas(chegada, almoco, voltaAlmoco, saida) {
//     // Convertendo os horários para objetos Date
//     const chegadaDate = new Date('1970-01-01T' + chegada + 'Z');  // Considerando horário no formato HH:mm
//     const almocoDate = new Date('1970-01-01T' + almoco + 'Z');
//     const voltaAlmocoDate = new Date('1970-01-01T' + voltaAlmoco + 'Z');
//     const saidaDate = new Date('1970-01-01T' + saida + 'Z');

//     // Calcular o tempo trabalhado antes do almoço (Chegada -> Almoço)
//     const { horas: horasAntesAlmoco, minutos: minutosAntesAlmoco } = calcularDiferencaHoras(chegadaDate, almocoDate);

//     // Calcular o tempo trabalhado depois do almoço (Volta do almoço -> Saída)
//     const { horas: horasDepoisAlmoco, minutos: minutosDepoisAlmoco } = calcularDiferencaHoras(voltaAlmocoDate, saidaDate);

//     // Somar as horas e minutos trabalhados
//     const totalHoras = horasAntesAlmoco + horasDepoisAlmoco;
//     const totalMinutos = minutosAntesAlmoco + minutosDepoisAlmoco;

//     // Ajustar minutos se excederem 60
//     const horasFinal = totalHoras + Math.floor(totalMinutos / 60);
//     const minutosFinal = totalMinutos % 60;

//     return { horas: horasFinal, minutos: minutosFinal };
// }

// // Exemplo de uso
// const chegada = "08:00";    // Hora de chegada (formato HH:mm)
// const almoco = "12:30";     // Hora de almoço
// const voltaAlmoco = "14:00"; // Hora de volta do almoço
// const saida = "17:00";      // Hora de saída

// const resultado = calcularHorasTrabalhadas(chegada, almoco, voltaAlmoco, saida);

// console.log(`Total de horas trabalhadas: ${resultado.horas} horas e ${resultado.minutos} minutos`);
////////////////////////////////////////////////////////////

// Função para calcular as horas trabalhadas
const calcularHorasTrabalhadas = (chegada, almoco, voltaAlmoco, saida) => {
  // Função interna para calcular a diferença em horas e minutos
  const calcularDiferenca = (inicial, final) => {
    const diffMs =
      new Date("1970-01-01T" + final + "Z") -
      new Date("1970-01-01T" + inicial + "Z");
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos };
  };

  // Função para formatar o horário de um objeto Date para "HH:mm"
  const formatarHora = (data) => {
    const horas = data.getHours().toString().padStart(2, "0"); // Adiciona 0 se for menor que 10
    const minutos = data.getMinutes().toString().padStart(2, "0"); // Adiciona 0 se for menor que 10
    return `${horas}:${minutos}`;
  };

  // Formatando os horários (inputs no formato Date)
  const chegadaFormatada = formatarHora(chegada);
  const almocoFormatado = formatarHora(almoco);
  const voltaAlmocoFormatada = formatarHora(voltaAlmoco);
  const saidaFormatada = formatarHora(saida);

  // Calcular as diferenças antes e depois do almoço
  const antesAlmoco = calcularDiferenca(chegadaFormatada, almocoFormatado);
  const depoisAlmoco = calcularDiferenca(voltaAlmocoFormatada, saidaFormatada);

  // Somar horas e minutos
  const totalHoras =
    antesAlmoco.horas +
    depoisAlmoco.horas +
    Math.floor((antesAlmoco.minutos + depoisAlmoco.minutos) / 60);
  const totalMinutos = (antesAlmoco.minutos + depoisAlmoco.minutos) % 60;

  return { horas: totalHoras, minutos: totalMinutos };
};

// Exemplo de uso com inputs no formato Date
const chegada = new Date("2024-12-12T08:00:00"); // Chegada: 08:00
const almoco = new Date("2024-12-12T12:00:00"); // Almoço: 12:00
const voltaAlmoco = new Date("2024-12-12T13:00:00"); // Volta do almoço: 13:00
const saida = new Date("2024-12-12T17:00:00"); // Saída: 17:00

// Calcular as horas trabalhadas
const resultado = calcularHorasTrabalhadas(chegada, almoco, voltaAlmoco, saida);

// Exibir o resultado
console.log(`${resultado.horas} horas e ${resultado.minutos} minutos`);

const horarioDeBrasilia = () => {
  const hoje = new Date();
  const fusoBrasilia = hoje.getHours() - 3;
  hoje.setHours(
    fusoBrasilia,
    hoje.getMinutes(),
    hoje.getSeconds(),
    hoje.getMilliseconds()
  );

  return hoje;
};

const data = horarioDeBrasilia(); // Data atual no fuso horário local
console.log("Data atual:", data);

// Criar uma nova instância de dataFim, começando com data
const dataFim = new Date(data);

// Ajustar o final do dia no fuso horário local (23:59:59.999)
dataFim.setHours(23, 59, 59, 999);

console.log("Data Fim:", dataFim);

const agora = new Date();
const ano = agora.getFullYear();
const mes = agora.getMonth() + 1; // Janeiro = 0, por isso +1
const dia = agora.getDate();
//'2024-12'
const ultimoDia = new Date(ano, mes, 0).getDate();
console.log(ultimoDia)
console.log(`${ano}-${mes}`)

function validarFormatoAnoMes(valor) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(valor);
}

// Exemplos de uso
console.log(validarFormatoAnoMes("2024-12")); // true
console.log(validarFormatoAnoMes("2024-13")); // false (mês inválido)
console.log(validarFormatoAnoMes("2024-02"));  // false (mês não tem dois dígitos)
console.log(validarFormatoAnoMes("24-12"));   // false (ano com menos de 4 dígitos)