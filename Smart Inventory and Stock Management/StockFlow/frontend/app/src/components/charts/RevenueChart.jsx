import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const RevenueChart = ({ data, labels, title = "Revenue Analysis" }) => {
    const chartData = {
        labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Revenue',
                data: data || [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(13, 110, 253, 0.7)',
                borderColor: 'rgb(13, 110, 253)',
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(13, 110, 253, 0.9)',
            },
            {
                label: 'Profit',
                data: data?.map(v => v * 0.3) || [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(25, 135, 84, 0.7)',
                borderColor: 'rgb(25, 135, 84)',
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(25, 135, 84, 0.9)',
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
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toFixed(0)
                    }
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }

    return (
        <div style={{ height: '300px' }}>
            <Bar data={chartData} options={options} />
        </div>
    )
}

export default RevenueChart