import React, { useRef, useEffect, useState } from 'react';
import { Chart as ReactChart } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const InteractiveChart = ({ data }) => {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chart3Ref = useRef(null);
  const [selection, setSelection] = useState({ start: null, end: null });
  const isSelecting = useRef(false);
  const selectionActive = useRef(false);
  
  // Преобразование данных из таблицы для графиков
  const processData = (rawData) => {
    // Здесь должна быть логика преобразования ваших данных из таблицы
    // в формат, подходящий для графиков
    
    // Примерные данные (замените на реальные преобразования)
    const dates = rawData.map(item => new Date(item.research_start_date));
    const rustData = rawData.map(item => item.oil_flow_correction_density * 10);
    const rustrData = rawData.map(item => item.fluid_density_vdp_operating * 10);
    
    const zaboyData = rawData.map(item => item.instrument_depth_tvd);
    const vdpData = rawData.map(item => item.perforation_top_tvd);
    const tempData = rawData.map(item => item.pressure_difference_depth_vdp_shutdown);
    
    const qlData = rawData.map(item => item.oil_flow_correction_density);
    const qnData = rawData.map(item => item.fluid_density_vdp_shutdown);
    const qgData = rawData.map(item => item.fluid_density_vdp_operating);
    
    return {
      labels: dates.map(date => date.toLocaleDateString()),
      rustData,
      rustrData,
      zaboyData,
      vdpData,
      tempData,
      qlData,
      qnData,
      qgData
    };
  };

  const { 
    labels, 
    rustData, 
    rustrData, 
    zaboyData, 
    vdpData, 
    tempData, 
    qlData, 
    qnData, 
    qgData 
  } = processData(data);

  // Данные для верхнего графика (Устьевое давление)
  const chartData1 = {
    labels,
    datasets: [
      {
        label: 'Руст (устьевое давление)',
        data: rustData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: 'Rустр (расчетное устьевое давление)',
        data: rustrData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.1,
        borderWidth: 2,
      }
    ],
  };

  // Данные для среднего графика (Забойное давление и температура)
  const chartData2 = {
    labels,
    datasets: [
      {
        label: 'Разб. на п. замерка',
        data: zaboyData,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Разб. на п. ВДП',
        data: vdpData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        yAxisID: 'y',
      },
      {
        label: 'Температура',
        data: tempData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        yAxisID: 'y1',
      }
    ],
  };

  // Данные для нижнего графика (Дебиты)
  const chartData3 = {
    labels,
    datasets: [
      {
        label: 'Qж (жидкость)',
        data: qlData,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: 'yellow',
        pointRadius: 6,
      },
      {
        label: 'Qн (нефть)',
        data: qnData,
        borderColor: 'rgb(255, 255, 255)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: 'white',
        pointRadius: 6,
      },
      {
        label: 'Qг (газ)',
        data: qgData,
        borderColor: 'rgb(201, 203, 207)',
        backgroundColor: 'rgba(201, 203, 207, 0.1)',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: 'gray',
        pointRadius: 6,
      }
    ],
  };

  // Настройки для верхнего графика
  const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Дата',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Устьевое давление, кгс/см²',
        },
        min: 0,
        max: 20,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Устьевое давление',
        font: {
          size: 16,
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  // Настройки для среднего графика
  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Дата',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Забойное давление, кгс/см²',
        },
        min: 234,
        max: 244,
      },
      y1: {
        beginAtZero: false,
        position: 'right',
        title: {
          display: true,
          text: 'Температура, °C',
        },
        min: 0,
        max: 50,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Забойное давление и температура',
        font: {
          size: 16,
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  // Настройки для нижнего графика
  const options3 = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Дата',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Дебиты (м³/сут и тыс. м³/м³)',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Дебиты жидкости, нефти и газа',
        font: {
          size: 16,
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  // Кастомный плагин для отрисовки выделения
  const selectionPlugin = {
    id: 'selectionPlugin',
    afterDraw(chart) {
      if (!selectionActive.current) return;
      
      const { ctx, chartArea, scales } = chart;
      const { start, end } = selection;
      
      if (start === null || end === null) return;
      
      const xScale = scales.x;
      const startPixel = xScale.getPixelForValue(start);
      const endPixel = xScale.getPixelForValue(end);
      
      const left = Math.min(startPixel, endPixel);
      const width = Math.abs(endPixel - startPixel);
      
      ctx.save();
      ctx.fillStyle = 'rgba(54, 162, 235, 0.2)';
      ctx.fillRect(left, chartArea.top, width, chartArea.bottom - chartArea.top);
      ctx.restore();
    }
  };

  // Эффект для настройки взаимодействия с графиками
  useEffect(() => {
    Chart.register(selectionPlugin);

    const setupChartInteractions = (chartRef) => {
      if (!chartRef.current) return;

      const chart = chartRef.current;
      const canvas = chart.canvas;

      const handleMouseDown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const scale = chart.scales.x;
        const value = scale.getValueForPixel(x);
        
        selectionActive.current = true;
        isSelecting.current = true;
        setSelection({ start: value, end: value });
      };

      const handleMouseMove = (e) => {
        if (!isSelecting.current) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const scale = chart.scales.x;
        const value = scale.getValueForPixel(x);
        
        setSelection(prev => ({ ...prev, end: value }));
        redrawCharts();
      };

      const handleMouseUp = () => {
        if (!isSelecting.current) return;
        
        isSelecting.current = false;
        if (selection.start === selection.end) {
          selectionActive.current = false;
          setSelection({ start: null, end: null });
        } else {
          console.log('Выделен диапазон:', selection);
        }
        redrawCharts();
      };

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
    };

    const cleanup1 = setupChartInteractions(chart1Ref);
    const cleanup2 = setupChartInteractions(chart2Ref);
    const cleanup3 = setupChartInteractions(chart3Ref);

    return () => {
      cleanup1 && cleanup1();
      cleanup2 && cleanup2();
      cleanup3 && cleanup3();
      Chart.unregister(selectionPlugin);
    };
  }, [selection]);

  const redrawCharts = () => {
    if (chart1Ref.current) chart1Ref.current.update();
    if (chart2Ref.current) chart2Ref.current.update();
    if (chart3Ref.current) chart3Ref.current.update();
  };

  const resetSelection = () => {
    selectionActive.current = false;
    setSelection({ start: null, end: null });
    redrawCharts();
  };

  // ! add save
  const saveToExcel = async () => {
    const wb = XLSX.utils.book_new();
    
    // Добавляем графики
    const chartsData = [
      { name: "Устьевое давление", data: chartData1 },
      { name: "Забойное давление", data: chartData2 },
      { name: "Дебиты", data: chartData3 }
    ];
    
    chartsData.forEach(chart => {
      const formattedData = chart.data.datasets.map(dataset => {
        const row = { Параметр: dataset.label };
        chart.data.labels.forEach((label, i) => {
          row[label] = dataset.data[i];
        });
        return row;
      });
      
      const ws = XLSX.utils.json_to_sheet(formattedData);
      XLSX.utils.book_append_sheet(wb, ws, chart.name);
    });

    // Добавляем сырые данные
    const rawWs = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, rawWs, "Исходные данные");

    XLSX.writeFile(wb, "Графики_исследований.xlsx");
  };

  // Функция сохранения в JPG
  const saveAsJPG = async () => {
    const charts = [
      { name: "Устьевое давление", ref: chart1Ref },
      { name: "Забойное давление", ref: chart2Ref },
      { name: "Дебиты", ref: chart3Ref }
    ];

    for (const chart of charts) {
      try {
        const canvas = chart.ref.current.canvas;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `${chart.name}.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error(`Ошибка при сохранении ${chart.name}:`, error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      <h2>Технологическая карта исследования скважины</h2>
      
      {/* Верхний график - Устьевое давление */}
      <div style={{ height: '300px', position: 'relative' }}>
        <ReactChart
          ref={chart1Ref}
          type="line"
          data={chartData1}
          options={options1}
          plugins={[selectionPlugin]}
        />
      </div>
      
      {/* Средний график - Забойное давление и температура */}
      <div style={{ height: '300px', position: 'relative' }}>
        <ReactChart
          ref={chart2Ref}
          type="line"
          data={chartData2}
          options={options2}
          plugins={[selectionPlugin]}
        />
      </div>
      
      {/* Нижний график - Дебиты */}
      <div style={{ height: '300px', position: 'relative' }}>
        <ReactChart
          ref={chart3Ref}
          type="line"
          data={chartData3}
          options={options3}
          plugins={[selectionPlugin]}
        />
      </div>
      
      <div>
        
        <button 
          onClick={resetSelection}
          disabled={!selectionActive.current}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Сбросить выделение
        </button>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={saveToExcel} style={buttonStyle('#4CAF50')}>
          Сохранить в Excel
        </button>
        <button onClick={saveAsJPG} style={buttonStyle('#2196F3')}>
          Сохранить как JPG
        </button>
      </div>
      </div>
    </div>
  );
};

export default InteractiveChart;

const buttonStyle = (color) => ({
  padding: '8px 16px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.3s',
  '&:hover': {
    opacity: 0.9
  }
});