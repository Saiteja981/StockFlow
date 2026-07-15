import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChartLine, FaDollarSign, FaShoppingCart, FaUsers, FaPlusCircle } from 'react-icons/fa'
import { salesApi, productApi, purchaseApi } from '../services/api'
import SalesChart from '../components/charts/SalesChart'
import CategoryChart from '../components/charts/CategoryChart'
import RevenueChart from '../components/charts/RevenueChart'
import ExportButton from '../components/reports/ExportButton'
import ReportFilters from '../components/reports/ReportFilters'
import { formatCurrency, formatDate } from '../utils/exportUtils'

const SalesAnalytics = () => {
    const [loading, setLoading] = useState(true)
    const [salesData, setSalesData] = useState([])
    const [products, setProducts] = useState([])
    const [purchases, setPurchases] = useState([])
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        reportType: 'sales',
        groupBy: 'month'
    })

    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        averageOrderValue: 0
    })

    const [chartData, setChartData] = useState({
        sales: [],
        labels: [],
        categories: [],
        categoryLabels: [],
        revenue: []
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [salesRes, productsRes, purchasesRes] = await Promise.all([
                salesApi.getAll(),
                productApi.getAll(),
                purchaseApi.getAll()
            ])

            setSalesData(salesRes.data)
            setProducts(productsRes.data)
            setPurchases(purchasesRes.data)

            calculateStats(salesRes.data, productsRes.data)
            prepareChartData(salesRes.data, productsRes.data)

            setLoading(false)
        } catch (error) {
            console.error('Error fetching analytics data:', error)
            setLoading(false)
        }
    }

    const calculateStats = (sales, products) => {
        const totalSales = sales.length
        const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
        const totalProducts = products.length
        const customers = new Set(sales.map(s => s.customerName).filter(Boolean))

        setStats({
            totalSales,
            totalRevenue,
            totalProducts,
            totalCustomers: customers.size,
            averageOrderValue: totalSales > 0 ? totalRevenue / totalSales : 0
        })
    }

    const prepareChartData = (sales, products) => {
        const salesByDate = {}
        sales.forEach(s => {
            const date = new Date(s.salesDate).toLocaleDateString()
            salesByDate[date] = (salesByDate[date] || 0) + (s.totalAmount || 0)
        })

        const sortedDates = Object.keys(salesByDate).sort()
        const salesValues = sortedDates.map(d => salesByDate[d])

        const categoryCount = {}
        products.forEach(p => {
            const cat = p.category || 'Uncategorized'
            categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })

        setChartData({
            sales: salesValues.length > 0 ? salesValues.slice(-7) : [0, 0, 0, 0, 0, 0, 0],
            labels: sortedDates.length > 0 ? sortedDates.slice(-7) : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            categories: Object.values(categoryCount),
            categoryLabels: Object.keys(categoryCount),
            revenue: salesValues.length > 0 ? salesValues.slice(-7) : [0, 0, 0, 0, 0, 0, 0]
        })
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const addSampleData = async () => {
        try {
            const productsRes = await productApi.getAll()

            if (productsRes.data.length === 0) {
                alert('❌ Please add some products first! Go to "Add Product" page.')
                return
            }

            const product = productsRes.data[0]
            const productId = product.id || product.productId

            const sampleSales = [
                {
                    productId: productId,
                    customerName: 'John Doe',
                    quantitySold: 2,
                    sellingPrice: 50,
                    salesDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    productId: productId,
                    customerName: 'Jane Smith',
                    quantitySold: 1,
                    sellingPrice: 75,
                    salesDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    productId: productId,
                    customerName: 'Bob Johnson',
                    quantitySold: 3,
                    sellingPrice: 60,
                    salesDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    productId: productId,
                    customerName: 'Alice Brown',
                    quantitySold: 1,
                    sellingPrice: 90,
                    salesDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
            ]

            for (const sale of sampleSales) {
                await salesApi.create(sale)
            }

            alert('✅ Sample sales data added successfully!')
            fetchData()
        } catch (error) {
            console.error('Error adding sample data:', error)
            alert('❌ Failed to add sample data. Make sure you have products and backend is running.')
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <FaChartLine className="me-2" />
                    Sales Analytics
                </h2>
                <div className="d-flex gap-2">
                    {salesData.length === 0 && (
                        <button
                            className="btn btn-outline-primary"
                            onClick={addSampleData}
                        >
                            <FaPlusCircle className="me-2" />
                            Add Sample Data
                        </button>
                    )}
                    <ExportButton
                        data={salesData}
                        filename="sales-report"
                        headers={[
                            'id', 'productName', 'customerName',
                            'quantitySold', 'sellingPrice',
                            'totalAmount', 'salesDate'
                        ]}
                    />
                </div>
            </div>

            <ReportFilters onFilterChange={handleFilterChange} />

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Sales</h6>
                                    <h2 className="card-text">{stats.totalSales}</h2>
                                </div>
                                <FaShoppingCart size={40} opacity={0.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Revenue</h6>
                                    <h2 className="card-text">{formatCurrency(stats.totalRevenue)}</h2>
                                </div>
                                <FaDollarSign size={40} opacity={0.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Avg Order Value</h6>
                                    <h2 className="card-text">{formatCurrency(stats.averageOrderValue)}</h2>
                                </div>
                                <FaChartLine size={40} opacity={0.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Customers</h6>
                                    <h2 className="card-text">{stats.totalCustomers}</h2>
                                </div>
                                <FaUsers size={40} opacity={0.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* No Data Message */}
            {salesData.length === 0 && (
                <div className="alert alert-info text-center">
                    <h4>📊 No Sales Data Yet</h4>
                    <p>Add some products and record sales to see analytics.</p>
                    <Link to="/addProduct" className="btn btn-primary me-2">
                        ➕ Add Product
                    </Link>
                    <Link to="/sales" className="btn btn-success">
                        📝 Record Sale
                    </Link>
                    <button
                        className="btn btn-outline-primary ms-2"
                        onClick={addSampleData}
                    >
                        <FaPlusCircle className="me-2" />
                        Add Sample Data
                    </button>
                </div>
            )}

            {/* Charts */}
            {salesData.length > 0 && (
                <>
                    <div className="row">
                        <div className="col-md-8 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">Sales & Revenue Trend</h5>
                                </div>
                                <div className="card-body">
                                    <SalesChart
                                        data={chartData.sales}
                                        labels={chartData.labels}
                                        title="Last 7 Days"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">Product Categories</h5>
                                </div>
                                <div className="card-body">
                                    <CategoryChart
                                        data={chartData.categories}
                                        labels={chartData.categoryLabels}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0">Revenue Breakdown</h5>
                                </div>
                                <div className="card-body">
                                    <RevenueChart
                                        data={chartData.revenue}
                                        labels={chartData.labels}
                                        title="Daily Revenue & Profit"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Sales Table */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Recent Sales</h5>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Sale ID</th>
                                        <th>Product</th>
                                        <th>Customer</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {salesData.slice(0, 10).map((sale) => (
                                        <tr key={sale.id || sale.salesId}>
                                            <td>#{sale.id || sale.salesId}</td>
                                            <td>{sale.productName || sale.product?.name || 'N/A'}</td>
                                            <td>{sale.customerName || 'N/A'}</td>
                                            <td>{sale.quantitySold}</td>
                                            <td>{formatCurrency(sale.totalAmount || sale.quantitySold * sale.sellingPrice)}</td>
                                            <td>{formatDate(sale.salesDate)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary me-2">Home</Link>
                <Link to="/products" className="btn btn-primary me-2">Products</Link>
                <Link to="/sales" className="btn btn-danger">Sales</Link>
            </div>
        </div>
    )
}

export default SalesAnalytics