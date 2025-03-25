# Animal Rescue

## Introduction
Animal Rescue is a platform designed to assist in the rescue, treatment, and adoption of injured animals. The platform enables users to report distressed animals, connect with NGOs, and contribute donations to help with medical treatments and rehabilitation.

## Features
- **Distress Reporting:** Users can report injured or stray animals by providing details and location.
- **NGO Collaboration:** Connects with local NGOs and rescue teams for efficient assistance.
- **Image Uploads:** Users can upload images of distressed animals for better identification.
- **Donation System:** Enables donations for the treatment and care of rescued animals.
- **Adoption Portal:** Provides an option for users to adopt rescued animals in need of a home.
- **Notification System:** Sends updates and alerts about reported cases and rescue actions.

## Tech Stack
### Backend:
- Node.js
- Express.js
- MongoDB
- Cloudinary (for image storage)
- Twilio (for SMS notifications)

### Frontend:
- React.js
- Vite
- Tailwind CSS

### Additional Services:
- Email and SMS notification system
- Secure authentication and user roles (NGOs, volunteers, users)
- Location-based tracking for distress reports

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Mayank-Nautiyal-01/Animal_Rescue.git
   ```
2. Navigate to the project folder:
   ```sh
   cd Animal_Rescue
   ```
3. Install dependencies for both frontend and backend:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
4. Set up environment variables in a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```
5. Start the backend server:
   ```sh
   cd backend
   npm run dev
   ```
6. Start the frontend:
   ```sh
   cd frontend
   npm run dev
   ```

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.



GitHub Repository: [Animal Rescue](https://github.com/Mayank-Nautiyal-01/Animal_Rescue)

