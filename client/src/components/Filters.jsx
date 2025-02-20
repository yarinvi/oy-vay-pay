import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, Trash2 } from 'lucide-react';
import '../styles/Filters.css';
import { FilterModal } from './FilterModal.jsx';


export const Filters = ({
  inputSearch,
  setInputSearch,
  selectedFilter,
  setSelectedFilter,
  maxAmount,
}) => {
  const MIN_BOUND = 0;
  const MAX_BOUND = maxAmount;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState([MIN_BOUND, MAX_BOUND]);

  useEffect(() => {
    setRangeValue([MIN_BOUND, MAX_BOUND]);
  }, [maxAmount]);


  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setIsFilterModalOpen(false);
  }

  const handleClearFilters = () => {
    setSelectedFilter(null);
    setRangeValue([MIN_BOUND, MAX_BOUND]);
  }

    return (
      <>
        <div className="filters">
        <input type="text" 
        placeholder="Search..." 
        value={inputSearch}
        onChange={({ target }) => setInputSearch(target.value)} 
        />
        <button onClick={() => setIsFilterModalOpen(true)}>
          <SlidersHorizontal />
        </button>
      </div>
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterSelect={handleFilterSelect}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        MIN_BOUND={MIN_BOUND}
        MAX_BOUND={MAX_BOUND}
      />
      {selectedFilter && (
        <div className="selected-filter">
          <span classname='filter-label'>
            Filter: Min: {selectedFilter.min} - {selectedFilter.max}
          </span>
          <Trash2 onClick={handleClearFilters} className='clear-filter-icon'/>
        </div>
      )}
      </>
    )
}


