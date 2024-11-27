# PureReact - The Developer Hub for All Things React

PureReact is a social content-sharing platform built for React developers. It allows users to create and manage posts efficiently. With secure authentication, post categorization, and reading list features, PureReact makes managing and discovering content straightforward and enjoyable.


## Features 🚀

### User Management
- **User Registration and Authentication**: Secure user sign-up with email verification and JWT-based authorization.
- **User Sign-in**: Secure login, with ability to reset password via a secure link through email.
- **Profile Management**: Update user information, add bios and social links for profile page.

### Post Management
- **Create, Edit, and Delete Posts**: Create post with **rich text editor**, add cover image, add category to post, ability to edit and delete existing post from user page.
- **Likes, Comments and Filter**: user can like and comment on other posts, filter posts based on popularity and recency.
- **Category Page**: Organize posts into relevant categories access posts on specific react topic on category page.
- **Reading List**: Save posts to your **Reading List** and revisit them later through your profile.


## Tech Stack 🛠️
- **Frontend**: React.js and TailwindCSS.
- **Backend**: Node.js and Express.js for API handling.
- **Database**: MongoDB for storing user data and posts, **Cloudinary**: for storing and delivering images.
- **Authentication**: JWT-based user authorization with email verification for secure login.


## Getting Started

### Installation
  - Clone the repository: `git clone https://github.com/Bharat610/purereact.git`
  - navigate to cd api and install dependency `npm install`
  - naivagte to cd client and install dependency `npm install`
  - create a .env file in the api folder with the following variables:

    ```bash
    MONGO_URL: your_mongo_db_connection_string
    ACCESS_SECRET_TOKEN: your_jwt_authorization_secret_token
    EMAIL_VERIFICATION_TOKEN: your_jwt_email_verification_secret_token
    EMAIL: your_email_service_user
    EMAIL_PASSWORD: your_email_service_password
    SENDER_EMAIL: sender_email_id
    PASSWORD_RESET_VERIFICATION_TOKEN: your_jwt_password_secret_token
    CLOUDINARY_CLOUD_NAME: your_cloudinary_cloud_name
    CLOUDINARY_API_KEY: your_cloudinary_api_key
    CLOUDINARY_API_SECRET: your_cloudinary_api_secret
    ```

  - Start the backend server `npm run start`
  - Start the frontend development server `npm run dev`
