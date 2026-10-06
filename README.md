# AI Interview Platform



An AI-powered interview platform that simulates real interview sessions using voice interaction, AI-generated questions, automated evaluation, and performance analytics.



The project is built with React on the frontend and Spring Boot on the backend, with Gemini AI and voice technologies integrated to create an interactive interview experience.



## Features



* AI-powered interview question generation

* Real-time interview simulation

* Voice-based interview interaction

* AI-based answer evaluation

* Adaptive interview flow based on candidate performance

* Interview performance scoring

* Analytics and performance charts

* User authentication

* Responsive interface for desktop and mobile

* Toast notifications and interactive UI

* REST API communication between frontend and backend



## Technology Stack



### Frontend



* React 19

* Vite

* JavaScript

* Tailwind CSS

* React Router

* Axios

* Firebase Authentication

* Framer Motion

* Chart.js

* React Icons

* React Hot Toast



### Backend



* Java 17

* Spring Boot 3

* Spring Web

* Spring Data JPA

* Spring Security

* Spring Validation

* Spring WebFlux

* Maven

* MySQL

* JWT

* Jackson



### AI and Voice



* Google Gemini API

* ElevenLabs voice technology



## System Architecture



```text

+-----------------------------+

|        User / Candidate     |

+-------------+---------------+

              |

              v

+-----------------------------+

|       React Frontend        |

|                             |

| - Interview UI              |

| - Authentication            |

| - Voice Interaction        |

| - Results and Analytics     |

+-------------+---------------+

              |

              | REST API

              v

+-----------------------------+

|      Spring Boot Backend    |

|                             |

| - REST APIs                 |

| - Business Logic            |

| - Authentication            |

| - Interview Processing      |

| - AI Integration            |

+-------------+---------------+

              |

       +------+------+

       |             |

       v             v

+------------+   +----------------+

|   MySQL    |   |   Gemini AI     |

|  Database  |   |   API           |

+------------+   +----------------+

                       |

                       v

                +---------------+

                | Voice Service |

                | ElevenLabs    |

                +---------------+

```



## How It Works



1. The candidate opens the AI Interview platform.

2. The candidate signs in to the application.

3. An interview session is started.

4. The system generates interview questions using AI.

5. The candidate answers the questions through the interview interface.

6. Voice interaction can be used during the interview.

7. The backend processes the interview data.

8. AI evaluates the candidate's responses.

9. The candidate receives performance results.

10. Charts and analytics help the candidate understand their interview performance.



## Project Structure



```text

AI-Interview/

|

+-- backend/

|   +-- src/

|   |   +-- main/

|   |       +-- java/

|   |       +-- resources/

|   +-- pom.xml

|

+-- public/

|

+-- src/

|   +-- components/

|   +-- pages/

|   +-- services/

|   +-- assets/

|   +-- App.jsx

|   +-- main.jsx

|

+-- .env.example

+-- .gitignore

+-- package.json

+-- vite.config.js

+-- README.md

```



## Frontend Setup



### 1. Clone the repository



```bash

git clone https://github.com/ganeshmunde-dev/AI-Interview.git

```



### 2. Open the project



```bash

cd AI-Interview

```



### 3. Install frontend dependencies



```bash

npm install

```



### 4. Configure environment variables



Create a `.env` file based on `.env.example`.



Example:



```env

VITE_FIREBASE_API_KEY=your_firebase_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain

VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id

VITE_FIREBASE_APP_ID=your_firebase_app_id



VITE_BACKEND_URL=http://localhost:8080

```



Do not commit the real `.env` file or API keys to GitHub.



### 5. Start the frontend



```bash

npm run dev

```



The Vite development server will normally run at:



```text

http://localhost:5173

```



## Backend Setup



### Requirements



* Java 17 or later

* Maven

* MySQL

* Gemini API credentials

* Required voice service credentials



### Run Backend



Open a terminal inside the backend directory:



```bash

cd backend

```



Then run:



```bash

mvn spring-boot:run

```



The backend runs on the configured Spring Boot port, commonly:



```text

http://localhost:8080

```



## Database



The backend uses MySQL for persistent application data.



Before starting the backend:



1. Install and start MySQL.

2. Create the required database.

3. Configure the database connection in your local Spring Boot configuration.

4. Add the required credentials locally.

5. Start the Spring Boot application.



Sensitive database credentials should never be committed to GitHub.



## Environment Variables



The project uses environment and local configuration files for sensitive information.



Examples include:



* Firebase configuration

* Backend URL

* Gemini API credentials

* Database credentials

* Voice service credentials



Sensitive configuration files are excluded through `.gitignore`.



## Development Commands



### Frontend



```bash

npm run dev

```



Build the production frontend:



```bash

npm run build

```



Preview the production build:



```bash

npm run preview

```



Run linting:



```bash

npm run lint

```



### Backend



```bash

mvn spring-boot:run

```



Build the backend:



```bash

mvn clean package

```



## Project Highlights



### AI Interview Simulation



The platform provides an interactive interview environment where candidates can practice interview questions in a realistic format.



### AI Evaluation



Candidate responses can be evaluated using AI-based processing to provide performance-oriented feedback.



### Voice Interaction



Voice technology makes the interview experience more interactive and closer to a real interview session.



### Performance Analytics



Chart.js is used to visualize interview performance and help candidates identify areas that need improvement.



### Responsive UI



The frontend is designed to work across desktop and mobile screen sizes.



## Future Improvements



* More interview categories

* Role-specific interview preparation

* Improved AI feedback

* Resume-based interview generation

* Advanced performance reports

* Interview history

* Candidate comparison

* More voice interaction options

* Deployment with production infrastructure



## Learning Outcomes



This project provided practical experience with:



* React application development

* REST API integration

* Spring Boot development

* Java backend development

* MySQL database integration

* Authentication

* AI API integration

* Voice API integration

* Data visualization

* Frontend and backend integration

* Environment and secret management

* Git and GitHub workflow



## Author



### Ganesh Munde



Frontend Developer | Java Full Stack Developer



GitHub:



https://github.com/ganeshmunde-dev



## Repository



https://github.com/ganeshmunde-dev/AI-Interview



## License



This project is developed for learning, portfolio, and educational purposes.






