import { useState, useEffect } from 'react';

export function useDateFormat(dateTimeStr) {
    const [relativeTime, setRelativeTime] = useState('');

    /**
     * Returns the ordinal suffix for a given day number.
     * @param {number} day - The day of the month.
     * @returns {string} The ordinal suffix.
     */
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }
    /**
     * Formats the date part of a Date object.
     * Example: "1st Jan" (same year) or "1st Jan 2026" (different year)
     * @param {Date} date - The date object.
     * @returns {string} The formatted date string.
     */
    function formatDatePart(date) {
        const day = date.getDate();
        const suffix = getOrdinalSuffix(day);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const currentYear = new Date().getFullYear();

        return year === currentYear
            ? `${day}${suffix} ${month}`
            : `${day}${suffix} ${month} ${year}`;
    }

    /**
     * Formats the time part of a Date object.
     * Example: "10am" or "10:15am"
     * @param {Date} date - The date object.
     * @returns {string} The formatted time string.
     */
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const displayHours = hours % 12 || 12;
        return minutes > 0
            ? `${displayHours}:${minutes < 10 ? '0' + minutes : minutes}${ampm}`
            : `${displayHours}${ampm}`;
    }

    /**
     * Formats an ISO date/time string or a range into a user-friendly format.
     * - Omits year if it's the current year
     * - Omits time if the date is more than 10 days away
     * 
     * Examples:
     *   Same year: "1st Jan | 10am"
     *   Different year: "1st Jan 2026 | 10am"
     *   Far future: "1st Jan 2026" (no time)
     */
    function formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return "";

        let startStr, endStr;
        if (dateTimeStr.includes('/')) {
            [startStr, endStr] = dateTimeStr.split('/');
        } else {
            startStr = dateTimeStr;
            endStr = null;
        }

        const startDate = new Date(startStr);
        if (isNaN(startDate.getTime())) {
            return "Invalid date";
        }

        // Check if date is more than 10 days away
        const now = new Date();
        const daysDifference = Math.floor((startDate - now) / (1000 * 60 * 60 * 24));
        const showTime = daysDifference <= 10;

        const formattedStart = showTime
            ? `${formatDatePart(startDate)} | ${formatTime(startDate)}`
            : formatDatePart(startDate);

        if (endStr) {
            const endDate = new Date(endStr);
            if (isNaN(endDate.getTime())) {
                return "Invalid date";
            }
            // Check if both dates are on the same day
            if (startDate.toDateString() === endDate.toDateString()) {
                return showTime
                    ? `${formatDatePart(startDate)} | ${formatTime(startDate)} - ${formatTime(endDate)}`
                    : formatDatePart(startDate);
            } else {
                return showTime
                    ? `${formattedStart} - ${formatDatePart(endDate)} | ${formatTime(endDate)}`
                    : `${formatDatePart(startDate)} - ${formatDatePart(endDate)}`;
            }
        }

        return formattedStart;
    }

    /**
     * Computes the relative time difference between now and a given ISO date/time string (or range).
     * For ranges, the start date/time is used for the calculation.
     *
     * Examples: 
     *    "In 5 minutes", "2 hours ago", "Happening now"
     *
     * @param {string} dateTimeStr - An ISO 8601 string or a datetime range.
     * @returns {string} A string representing the relative time difference.
     */
    function getDifference(dateTimeStr) {
        if (!dateTimeStr) return "";

        const compareStr = dateTimeStr.includes('/') ? dateTimeStr.split('/')[0] : dateTimeStr;
        const eventDate = new Date(compareStr);
        if (isNaN(eventDate.getTime())) {
            return "Invalid date";
        }

        const now = new Date();
        const diffInMs = eventDate - now;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
        const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

        if (diffInMs < 0) {
            const absMinutes = Math.abs(diffInMinutes);
            const absHours = Math.abs(diffInHours);
            const absDays = Math.abs(diffInDays);
            const absMonths = Math.abs(diffInMonths);
            const absYears = Math.abs(diffInYears);
            if (absMinutes < 60) return `${absMinutes} minutes ago`;
            if (absHours < 24) return `${absHours} hours ago`;
            if (absDays < 30) return `${absDays} days ago`;
            if (absMonths < 12) return `${absMonths} months ago`;
            return `${absYears} years ago`;
        } else {
            if (diffInMinutes < 1) return "Happening now";
            if (diffInMinutes < 60) return `In ${diffInMinutes} minutes`;
            if (diffInHours < 24) return `In ${diffInHours} hours`;
            if (diffInDays < 30) return `In ${diffInDays} days`;
            if (diffInMonths < 12) return `In ${diffInMonths} months`;
            return `In ${diffInYears} years`;
        }
    }

    /**
     * Returns just the formatted time part of the date.
     * Example: "10am" or "10:15am"
     * @param {string} dateTimeStr - An ISO 8601 string or a datetime range.
     * @returns {string} The formatted time string.
     */
    function getTimeOnly(dateTimeStr) {
        if (!dateTimeStr) return "";

        const compareStr = dateTimeStr.includes('/') ? dateTimeStr.split('/')[0] : dateTimeStr;
        const date = new Date(compareStr);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }

        return formatTime(date);
    }

    // Add reactive updates for relative time
    useEffect(() => {
        const updateRelativeTime = () => {
            setRelativeTime(getDifference(dateTimeStr));
        };

        // Update immediately
        updateRelativeTime();

        // Update every minute
        const interval = setInterval(updateRelativeTime, 60000);

        return () => clearInterval(interval);
    }, [dateTimeStr]);

    return {
        formattedDateTime: formatDateTime(dateTimeStr),
        relativeTime,
        formatDateTime,
        getDifference,
        getTimeOnly
    };
} 