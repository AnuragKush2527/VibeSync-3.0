# PROJECT SETUP

## 1. Clone the Repository
Create a new folder in desktop, open with code editor and run the following command:     
git clone https://github.com/AnuragKush2527/VibeSync-3.0.git

## 2. Install Dependencies

**Front-end**    
First run: cd vibesync-client    
then: npm install

**Back-end**    
First run: cd vibesync-server    
then: npm install

**model-FASTAPI**    
First run: cd model    
then: pip install -r requirements.txt

## 3. Use the required Environment Variables
Create .env inside front-end and back-end folders with following variables.

**Front-end**    
REACT_APP_CLOUDINARY_ID =     
REACT_APP_URL =

**Back-end**    
MONGODB_URL =     
JWT_SECRET_KEY =     
PORT =     
AUTH_EMAIL =     
AUTH_PASS=     
APP_URL=     
FASTAPI_URL=

## 4. Run the App

**Front-end**     
npm start

**Back-end**     
npm start

**FASTAPI-model**      
uvicorn main:app --reload
