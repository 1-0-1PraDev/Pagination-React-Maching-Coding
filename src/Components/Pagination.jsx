import React, { useMemo, useState } from 'react'
import useFetchData from '../Hooks/useFetchData';
import "../Styles/pagination.css";

const API_URL = `https://jsonplaceholder.typicode.com/posts`;

const Pagination = () => {
    const { data, loading, error } = useFetchData(API_URL);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageInput, setPageInput] = useState("");

    const totalPages = useMemo(() => {
        return Math.ceil(data.length / rowsPerPage);
    }, [data, rowsPerPage]);

    // Perform pagination calculation
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return data.slice(startIndex, endIndex);
    }, [currentPage, rowsPerPage, data]);

    const handleSelectChange = (e) => {
        setRowsPerPage(+e.target.value);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage((prevState) => prevState - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage <= totalPages) {
            setCurrentPage((prevState) => prevState + 1);
        }
    };

    const handlePageJump = (e) => {
        let pageNumber = parseInt(pageInput, 10);

        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setPageInput("");
        }
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    const generatePageNumbers = () => {
        const pageNumbers = [];
        const visiblePages = 3;

        // visiblePages * 2 accounts for pages both before and after the current page.
        // + 1 includes the current page.
        const maxPageNumbersToShow = visiblePages * 2 + 1;
        const startPage = Math.max(1, currentPage - visiblePages);
        const endPage = Math.min(totalPages, currentPage + visiblePages);

        // starting page number or dots
        if (currentPage - visiblePages > 1) {
            pageNumbers.push(1);

            if (currentPage - visiblePages > 2) {
                pageNumbers.push("...");
            }
        }

        // show page numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // ending page or dots
        if (currentPage + visiblePages < totalPages) {
            if (currentPage + visiblePages < totalPages - 1) {
                pageNumbers.push("...");
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    }

    if (loading) return <p>Loading data...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <>
            <div className="main-container">
                {/* Header */}
                <div className="header">
                    <div className='leftBx'>
                        <p>Select per rows: </p>
                        <div className="selectBx">
                            <select onChange={handleSelectChange}>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                    </div>
                    <div className='rightBx'>
                        <input
                            type="text"
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            placeholder="type number to hop on..."
                            className=""
                        />
                        <button className='btn' onClick={handlePageJump}>Jump</button>
                    </div>
                </div>

                {/* Pagination  */}
                <div className="pagination-container">
                    <button className="btn btn-prev" onClick={handlePrevClick} disabled={currentPage === 1}>
                        Prev
                    </button>

                    {generatePageNumbers().map((page, ind) => (
                        <button
                            key={ind}
                            onClick={() => typeof page === "number" && handlePageChange(page)}
                            disabled={page === currentPage || page === "..."}
                            className='btn'
                        >
                            {page}
                        </button>
                    ))}


                    <button className="btn btn-next" onClick={handleNextClick} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>

                {/* Data rendered */}
                <div className="cards-container">
                    {paginatedData.map((element) => {
                        return (
                            <article key={element.id} className='card'>
                                <h2>
                                    {element.id}. {element.title}
                                </h2>
                                <p>{element.body}</p>
                            </article>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default Pagination;