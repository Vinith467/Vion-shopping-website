import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ label, tags, onChange, placeholder, suggestions = [] }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Filter suggestions based on input, excluding already selected tags
  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  );

  const handleAddTag = (tagText) => {
    const trimmed = tagText.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-gray-800 dark:text-[#F5F0E8] uppercase tracking-wider mb-1.5">{label}</label>
      <div 
        className={`w-full p-1.5 rounded-xl bg-gray-50 border ${isFocused ? 'bg-white dark:bg-[#151515] transition-colors duration-500 border-[#3A10E5]' : 'border-gray-200'} transition-all min-h-[46px] flex flex-wrap gap-1.5 items-center cursor-text`}
        onClick={() => setIsFocused(true)}
      >
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center gap-1 bg-[#3A10E5]/10 text-[#3A10E5] px-2.5 py-1 rounded-md text-sm font-semibold">
            {tag}
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); removeTag(index); }}
              className="hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none px-2 text-sm text-gray-900 dark:text-[#F5F0E8] placeholder:text-gray-400 font-medium h-8"
        />
      </div>

      {isFocused && (inputValue.length > 0 || filteredSuggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#151515] transition-colors duration-500 border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
          {inputValue.length > 0 && !tags.includes(inputValue.trim()) && !filteredSuggestions.includes(inputValue.trim()) && (
            <div 
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center text-[#3A10E5] font-medium border-b border-gray-100 last:border-0"
              onClick={() => handleAddTag(inputValue)}
            >
              <span className="font-bold mr-1">Create:</span> "{inputValue}"
            </div>
          )}
          {filteredSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-medium"
              onClick={() => handleAddTag(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
