import { navigateTo } from "../routes/routechecker.js";

class ApiService {
    constructor() {
        this.baseURL = 'http://your-backend-api-url'; // Replace with your actual backend API URL
    }

    async registerUser(data) {
        fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    response.json()
                        .then(error => {
                            console.log(error)
                        })
                } else {
                    throw new Error('Erreur de réseau');
                }
            }
            return response
        }).then(data => {
            if (data) {
                // Redirect to login page
                navigateTo('login')
            }
        }).catch(console.log);
    }

    async loginUser(data) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                if (response.status === 400) {
                    const error = await response.json()
                    console.log(error)
                } else {
                    throw new Error('Network error')
                }
            }
            return  await response.json()
        } catch (error) {
            console.log(error);
            throw error;  // Re-throw the error so it can be caught in the calling code
        }
    }


}
// Add methods for other API calls (create post, get posts, etc.) as needed

export const API_SERVICE = new ApiService();
