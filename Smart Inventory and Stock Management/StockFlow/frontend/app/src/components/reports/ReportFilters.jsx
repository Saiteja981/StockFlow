import React, { useState } from 'react'
import { FaFilter } from 'react-icons/fa'

const ReportFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        reportType: 'sales',
        groupBy: 'month'
    })

    const handleChange = (e) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value
        }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="mb-3">
                    <FaFilter className="me-2" />
                    Report Filters
                </h5>

                <div className="row">
                    <div className="col-md-3 mb-2">
                        <label className="form-label">Report Type</label>
                        <select
                            className="form-select form-select-sm"
                            name="reportType"
                            value={filters.reportType}
                            onChange={handleChange}
                        >
                            <option value="sales">Sales Report</option>
                            <option value="purchases">Purchase Report</option>
                            <option value="products">Product Report</option>
                            <option value="revenue">Revenue Report</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2">
                        <label className="form-label">Group By</label>
                        <select
                            className="form-select form-select-sm"
                            name="groupBy"
                            value={filters.groupBy}
                            onChange={handleChange}
                        >
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                            <option value="year">Yearly</option>
                        </select>
                    </div>

                    <div className="col-md-3 mb-2">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3 mb-2">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportFilters