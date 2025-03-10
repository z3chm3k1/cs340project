/**
 * Common utility functions for Crazy Pizza Order Management System
 */

/**
 * Redirects to a specific page
 * @param {string} page - The page to navigate to
 */
function navigateTo(page) {
    window.location.href = page;
}

/**
 * Format a price as currency
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

/**
 * Format a date for display
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

/**
 * Show a confirmation dialog
 * @param {string} message - The message to display
 * @returns {boolean} - True if confirmed, false otherwise
 */
function confirmAction(message) {
    return confirm(message);
}

/**
 * Display an error message
 * @param {string} message - The error message
 */
function showError(message) {
    alert('Error: ' + message);
    console.error(message);
}

/**
 * Display a success message
 * @param {string} message - The success message
 */
function showSuccess(message) {
    alert(message);
}

/**
 * Helper function to make API requests
 * @param {string} url - The API endpoint
 * @param {string} method - The HTTP method
 * @param {object} data - The data to send (for POST/PUT)
 * @returns {Promise} - The fetch promise
 */
async function apiRequest(url, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        // Check for JSON response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.error || `HTTP error! Status: ${response.status}`);
            }
            
            return responseData;
        } else {
            const text = await response.text();
            if (!response.ok) {
                throw new Error(`Non-JSON error response! Status: ${response.status}`);
            }
            return text;
        }
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}