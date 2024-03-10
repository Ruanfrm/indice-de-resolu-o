// Função para calcular a porcentagem de resolução
function calculateResolutionPercentage(resolved, unresolved) {
  const total = resolved + unresolved;
  return total !== 0 ? ((resolved / total) * 100).toFixed(2) : 0;
}

// Função para atualizar a porcentagem de resolução na tela
function updateResolutionPercentage(percentage) {
  document.getElementById('resolution-percentage').innerHTML = `${percentage}%`;
}

// Função para formatar números com separador de milhares
function formatNumber(number) {
  return number.toLocaleString('pt-BR');
}

// Função para atualizar o gráfico
function updateChart(resolved, unresolved) {
  chart.data.datasets[0].data = [resolved, unresolved];
  chart.update();
}

// Função para atualizar as informações de resolução
function updateResolutionInfo(resolved, unresolved) {
  document.getElementById('resolution-info').innerHTML = `
    Resolvido: ${formatNumber(resolved)}  -
    Não Resolvido: ${formatNumber(unresolved)}
  `;
}

// Função para salvar os dados no Local Storage
function saveDataToLocalStorage(resolved, unresolved, percentage, historyData) {
  localStorage.setItem('lastResolved', resolved);
  localStorage.setItem('lastUnresolved', unresolved);
  localStorage.setItem('lastResolutionPercentage', percentage);
  localStorage.setItem('historyData', JSON.stringify(historyData));
}

// Função para carregar e renderizar os dados do Local Storage
function loadAndRenderDataFromLocalStorage() {
  const lastResolved = parseInt(localStorage.getItem('lastResolved')) || 0;
  const lastUnresolved = parseInt(localStorage.getItem('lastUnresolved')) || 0;

  // Correção: verificar se a porcentagem existe antes de converter para float
  const savedPercentage = localStorage.getItem('lastResolutionPercentage');
  const lastPercentage = savedPercentage !== null ? parseFloat(savedPercentage) : 0;

  const historyData = JSON.parse(localStorage.getItem('historyData')) || [];

  updateChart(lastResolved, lastUnresolved);
  updateResolutionInfo(lastResolved, lastUnresolved);
  updateResolutionPercentage(lastPercentage);

  document.getElementById('resolved').value = lastResolved;
  document.getElementById('unresolved').value = lastUnresolved;

  // Renderiza o gráfico de histórico
  createHistoryChart(historyData);
}

// Função para criar o gráfico de histórico
function createHistoryChart(historyData) {
  const labels = historyData.map(item => item.date);
  const percentages = historyData.map(item => item.percentage);

  const chartData = {
    labels: labels,
    datasets: [{
      data: percentages,
      label: 'Índice de Resolução',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Data',
          color: '#ffffff',
          font: {
            family: 'Arial, sans-serif',
            size: 14,
          },
        },
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Porcentagem (%)',
          color: '#ffffff',
          font: {
            family: 'Arial, sans-serif',
            size: 14,
          },
        },
      }],
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            family: 'Arial, sans-serif',
            size: 14,
          },
        },
      },
    },
  };

  const historyChartCanvas = document.getElementById('history-chart');
  const historyChart = new Chart(historyChartCanvas, {
    type: 'line',
    data: chartData,
    options: chartOptions,
  });
}

// Função para buscar dados históricos
function fetchHistoryData(startDate, endDate) {
  // Insira sua lógica para buscar dados históricos com base nas datas
  // Retorne um array de objetos com "date" e "percentage"

  const mockData = [
    {
      date: '2023-03-01',
      percentage: 70,
    },
    {
      date: '2023-03-02',
      percentage: 65,
    },
    // ...
  ];

  return mockData;
}

// Event listener para o envio do formulário
document.getElementById('resolutionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const resolved = parseInt(document.getElementById('resolved').value);
  const unresolved = parseInt(document.getElementById('unresolved').value);

  // Calcula a porcentagem de resolução
  const percentage = calculateResolutionPercentage(resolved, unresolved);

  // Cria um objeto com data e porcentagem para o histórico
  const historyEntry = {
    date: new Date().toISOString().split('T')[0],
    percentage: percentage,
  };

  // Recupera dados históricos do Local Storage
  const historyData = JSON.parse(localStorage.getItem('historyData')) || [];

  // Adiciona a nova entrada ao histórico
  historyData.push(historyEntry);

  // Salva os dados atualizados no Local Storage
  saveDataToLocalStorage(resolved, unresolved, percentage, historyData);

  // Atualiza o gráfico e as informações de resolução
  updateChart(resolved, unresolved);
  updateResolutionInfo(resolved, unresolved);
  updateResolutionPercentage(percentage);

  // Atualiza o gráfico de histórico
  createHistoryChart(historyData);
});

// Event listener para aplicar filtros
document.getElementById('applyFilters').addEventListener('click', function() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Valida as datas
  if (!startDate || !endDate) {
    alert('Por favor, informe ambas as datas para aplicar os filtros.');
    return;
  }

  // Recupera dados históricos do Local Storage
  const historyData = JSON.parse(localStorage.getItem('historyData')) || [];

  // Filtra os dados por data
  const filteredData = historyData.filter(item => {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });

  // Atualiza o gráfico de histórico com os dados filtrados
  createHistoryChart(filteredData);
});


// Inicializa o gráfico
let chartType = 'doughnut';
const chartCanvas = document.getElementById('chart').getContext('2d');
let chart = createChart(chartCanvas, chartType);

// Função para criar o gráfico
function createChart(canvas, type) {
  return new Chart(canvas, {
    type: type,
    data: {
      labels: ['Resolvido', 'Não Resolvido'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 0
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}

// Event listener para mudar o tipo de gráfico
document.querySelectorAll('.change-chart').forEach(function(button) {
  button.addEventListener('click', function() {
    const type = this.getAttribute('data-type');
    chart.destroy();
    chart = createChart(chartCanvas, type);
    updateChart(parseInt(document.getElementById('resolved').value), parseInt(document.getElementById('unresolved').value));
  });
});

// Verifica se há um valor salvo no Local Storage e atualiza o gráfico se houver
window.addEventListener('DOMContentLoaded', function() {
  loadAndRenderDataFromLocalStorage();
});

