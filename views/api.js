// API configuration
// const API_BASE_URL = 'http://localhost:5000/api';
 const API_BASE_URL = 'https://roadside-helper.onrender.com';
// Helper function for making API calls
async function makeApiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Add token to headers if available
        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log(`Making ${method} request to ${API_BASE_URL}${endpoint}`, data ? `with data: ${JSON.stringify(data)}` : '');
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        let result;
        
        try {
            result = await response.json();
            console.log(`Response from ${endpoint}:`, result);
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            result = { error: 'Invalid response from server' };
        }
        
        if (!response.ok) {
            throw {
                response: {
                    data: result || { error: 'Unknown error occurred' }
                }
            };
        }
        
        return { data: result };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Customer API calls
const customerApi = {
    login: (credentials) => makeApiCall('/customers/login', 'POST', credentials),
    register: (userData) => makeApiCall('/customers/register', 'POST', userData),
    getProfile: () => makeApiCall('/customers/profile'),
    updateProfile: (data) => makeApiCall('/customers/profile', 'PUT', data),
    getServiceHistory: () => makeApiCall('/customers/history'),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = 'loginuser.html';
    }
};

// Mechanic API calls
const mechanicApi = {
    login: (credentials) => makeApiCall('/mechanics/login', 'POST', credentials),
    register: (mechanicData) => makeApiCall('/mechanics/register', 'POST', mechanicData),
    getProfile: () => makeApiCall('/mechanics/profile'),
    updateProfile: (data) => makeApiCall('/mechanics/profile', 'PUT', data),
    getMechanicProfiles: () => makeApiCall('/mechanics/profiles'),
    getServices: (status) => makeApiCall(`/services/mechanic/${encodeURIComponent(JSON.parse(localStorage.getItem('user')).name)}${status ? `?status=${status}` : ''}`),
    getPendingServices: () => mechanicApi.getServices('pending'),
    getAcceptedServices: () => mechanicApi.getServices('accepted'),
    getCompletedServices: () => mechanicApi.getServices('completed'),
    updateServiceStatus: (serviceId, status) => makeApiCall(`/services/${serviceId}/status`, 'PUT', { status }),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = 'meclogin.html';
    }
};

// Export the API functions
window.customerApi = customerApi;
window.mechanicApi = mechanicApi;
window.api = {
    registerMechanic: mechanicApi.register,
    loginMechanic: mechanicApi.login,
    getMechanicProfile: mechanicApi.getProfile,
    getMechanicServices: mechanicApi.getServices,
    getPendingServices: mechanicApi.getPendingServices,
    updateServiceStatus: mechanicApi.updateServiceStatus
}; 
