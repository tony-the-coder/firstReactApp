import React from 'react'
// Destructure the props
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">

            <div>
                <img src="search.svg" alt="Search" />
<input type="text"
placeholder="Search through movies"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/>
            </div>

        </div>
    )
}
export default Search
