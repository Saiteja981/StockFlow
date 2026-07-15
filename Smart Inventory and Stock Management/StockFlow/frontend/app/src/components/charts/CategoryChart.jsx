import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const CategoryChart = ({ data, labels, colors }) => {
    const defaultColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ]

    const chartData = {
        labels: labels || ['Electronics', 'Clothing', 'Food', 'Books'],
        datasets: [
            {
                data: data || [30, 25, 20, 25],
                backgroundColor: colors || defaultColors,
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 8,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((context.parsed / total) * 100).toFixed(1)
                        return `${context.label}: ${context.parsed} (${percentage}%)`
                    }
                }
            }
        },
        cutout: '60%',
        animation: {
            animateRotate: true,
            animateScale: true
        }
    }

    return (
        <div style={{ height: '280px' }}>
            <Doughnut data={chartData} options={options} />
        </div>
    )
}

export default CategoryChart