
# FE-Insurance-Portal

FE-Insurance-Portal is a frontend application designed to support Bridging Data RSUS . This project includes various features and interactive user interfaces to facilitate data management.


## Dependencies

Before you begin, make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v20.18)
-   npm (installed alongside Node.js)
-   [Git](https://git-scm.com/)

## Instalation

Follow these steps to install and run this project locally:

1.  **Clone Repository**
    
    ```bash
    git clone https://github.com/raiszidane95/FE-UHC-MCU.git
    
    ```
    
    Go to the project directory:
    
    ```bash
    cd FE-UHC-MCU
    
    ```
    
2.  **Install Project Dependencies**
    
	  Run the following command to install all required project dependencies:
    
    ```bash
    npm install
    
    ```
    
3.  **Starting Development Mode**
    
    Setelah semua dependensi terinstal, jalankan aplikasi dengan perintah berikut:
    
    ```bash
    npm run dev
    
    ```
    
	  the application will run on default http://localhost:5173
    

## Project Structure

Here is the main directory structure in this project:
```
Insurance-Portal/
├── public/         # Static File
├── src/            # Main source code
│   ├── assets/     # Projects assets
│   ├── components/ # React Components
│   ├── constants/  # Constants values
│   ├── hooks/	    # Custom hooks
│   ├── routes/	    # Pages route
│   ├── service/    # API fetch service
│   ├── Utils/ 	    # Utility function  
│   ├── pages/      # App pages
│   ├── App.js      # Main component
│   └── index.js    # App entry point
├── package.json    # npm configurations and package list
└── README.md       # Project docs

```

## Available Scripts

This project supports the following scripts:

-   **`npm run dev`**: To run app development mode.
-   **`npm run build`**: To build the application to be production ready in the `dist` folder.
-   **`npm run preview`**: To run app build preview on port http://localhost:4173

    
For more information, visit this repository on [GitHub](https://github.com/raiszidane95/FE-UHC-MCU).
