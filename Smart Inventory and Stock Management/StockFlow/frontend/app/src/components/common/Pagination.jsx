import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({
                        currentPage,
                        totalPages,
                        itemsPerPage,
                        totalItems,
                        onPageChange,
                        onItemsPerPageChange
                    }) => {
    const pageNumbers = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    if (totalPages === 0) return null

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3">
            <div className="mb-2 mb-md-0">
                <small className="text-muted">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                </small>
                <select
                    className="form-select form-select-sm d-inline-block ms-2"
                    style={{ width: 'auto' }}
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <nav>
                <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            <FaChevronLeft />
                        </button>
                    </li>

                    {startPage > 1 && (
                        <>
                            <li className="page-item">
                                <button className="page-link" onClick={() => onPageChange(1)}>
                                    1
                                </button>
                            </li>
                            {startPage > 2 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <li
                            key={number}
                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(number)}
                            >
                                {number}
                            </button>
                        </li>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <li className="page-item disabled">
                                    <span className="page-link">...</span>
                                </li>
                            )}
                            <li className="page-item">
                                <button className="page-link" onClick={() => onPageChange(totalPages)}>
                                    {totalPages}
                                </button>
                            </li>
                        </>
                    )}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <FaChevronRight />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination