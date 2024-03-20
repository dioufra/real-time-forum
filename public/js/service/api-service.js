import { FORM_CONTROLLER } from "../controllers/form.js";
import { navigateTo } from "../routes/routechecker.js";
import { updateSingleComponent } from "../script.js";

class ApiService {
    constructor() {
        this.baseURL = 'http://your-backend-api-url'; // Replace with your actual backend API URL
    }

    async registerUser(data) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });
    
            if (!response.ok)  {
                const error = await response.json();
                FORM_CONTROLLER.setError('register', error.message || 'Something went wrong');
                throw new Error(`Failed to register: ${response.statusText}`);
            }
            return await response.json()
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
    

    async loginUser(data) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                
                const error = await response.json();
                // Assuming FORM_CONTROLLER.setError sets an error state on the form
                console.log(error.message);
                FORM_CONTROLLER.setError('login', error.message || 'Something went wrong');
                throw new Error(`Failed to login user: ${response.statusText}`);
            }
            return await response.json()
        } catch (error) {
            throw error;  // Re-throw the error so it can be caught in the calling code
        }
    }


}
// Add methods for other API calls (create post, get posts, etc.) as needed

export const API_SERVICE = new ApiService();
