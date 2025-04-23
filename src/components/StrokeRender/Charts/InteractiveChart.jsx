import React, { useRef, useEffect, useState } from 'react';
import { Chart as ReactChart } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';

const InteractiveChart = () => {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const [selection, setSelection] = useState({ start: null, end: null });
  const isSelecting = useRef(false);
  const selectionActive = useRef(false);
  const [data1, setData1] = useState()
  const [data2, setData2] = useState()
  const [labels, setLabels] = useState()
  // Генерация данных для графиков
  const generateData = () => {
    const labels = Array.from({ length: 12 }, (_, i) => `Месяц ${i + 1}`);
    const data1 = labels.map(() => Math.floor(Math.random() * 100));
    const data2 = labels.map(() => Math.floor(Math.random() * 100));
    
    return { labels, data1, data2 };
  };

  useEffect(()=>{
    const { labels, data1, data2 } = generateData();
    setData1(data1)
    setData2(data2)
    setLabels(labels)
  }, [])
  const chartData1 = {
    labels,
    datasets: [{
      label: 'График 1 - Продажи',
      data: data1,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.1,
      fill: true,
    }],
  };

  const chartData2 = {
    labels,
    datasets: [{
      label: 'График 2 - Трафик',
      data: data2,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      tension: 0.1,
      fill: true,
    }],
  };

  // Общие настройки для обоих графиков
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Функция для перерисовки обоих графиков
  const redrawCharts = () => {
    if (chart1Ref.current) chart1Ref.current.update();
    if (chart2Ref.current) chart2Ref.current.update();
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
          // Если выделение нулевое - сбрасываем
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

    return () => {
      cleanup1 && cleanup1();
      cleanup2 && cleanup2();
      Chart.unregister(selectionPlugin);
    };
  }, [selection]);

  const resetSelection = () => {
    selectionActive.current = false;
    setSelection({ start: null, end: null });
    redrawCharts();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Синхронизированные графики с выделением области</h2>
      <div style={{ height: '300px', position: 'relative' }}>
        <ReactChart
          ref={chart1Ref}
          type="line"
          data={chartData1}
          options={commonOptions}
          plugins={[selectionPlugin]}
        />
      </div>
      <div style={{ height: '300px', position: 'relative' }}>
        <ReactChart
          ref={chart2Ref}
          type="line"
          data={chartData2}
          options={commonOptions}
          plugins={[selectionPlugin]}
        />
      </div>
      <div>
        <p>Выделите область на любом из графиков - выделение появится на обоих</p>
        {selection.start && selection.end && selection.start !== selection.end ? (
          <p>Выделенный диапазон: от {selection.start} до {selection.end}</p>
        ) : null}
      </div>
      <button 
        onClick={resetSelection}
        disabled={!selectionActive.current}
      >
        Сбросить выделение
      </button>
    </div>
  );
};

export default InteractiveChart;