import { NextResponse } from "next/server";

// Base configuration
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Generic HTTP client with error handling
class HttpClient {

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
        };
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const result = await response.json();
            const errorMessage = result.message || 'An unknown error occurred';
            throw new Error(errorMessage);
        }
        return response;
    }

    public async get(url: string) {
        try {
            const response = await fetch(`${apiUrl}/${url}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error) {
            return NextResponse.json(
                { error: 'Network or server error', details: error },
                { status: 500 }
            );
        }
    }

    public async post(url: string, data?: Record<string, unknown>) {
        try {
            const response = await fetch(`${apiUrl}/${url}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse(response);
        } catch (error) {
            console.log(error);
            throw new Error('Network or server error');
        }
    }

    public async put(url: string, data: Record<string, unknown>) {
        try {
            const response = await fetch(`${apiUrl}/${url}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            return this.handleResponse(response);
        } catch (error) {
            return NextResponse.json(
                { error: 'Network or server error', details: error },
                { status: 500 }
            );
        }
    }

    public async delete(url: string) {
        try {
            const response = await fetch(`${apiUrl}/${url}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            return this.handleResponse(response);
        } catch (error) {
            return NextResponse.json(
                { error: 'Network or server error', details: error },
                { status: 500 }
            );
        }
    }
}

// Create a singleton instance
const httpClient = new HttpClient();

// Export methods for ease of use
export const fetchGet = httpClient.get.bind(httpClient);
export const fetchPost = httpClient.post.bind(httpClient);
export const fetchPut = httpClient.put.bind(httpClient);
export const fetchDelete = httpClient.delete.bind(httpClient);

// Export the client for advanced usage
export default httpClient;