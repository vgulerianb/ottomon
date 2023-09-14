# Ottomon: Chat with code, videos, and docs

Ottomon is a powerful GenAI platform that empowers you to effortlessly transform any website, YouTube channel, or GitHub repository into a dynamic chatbot. Whether you're looking to enhance user engagement, streamline support, or simply explore new possibilities, Ottomon has you covered.

## Getting Started

To get started with Ottomon, follow these simple steps:

1. **Clone the Repository**: Begin by cloning the Ottomon repository to your local environment.

   ```shell
   git clone https://github.com/vgulerianb/ottomon.git
   ```

2. **Configuration**: Create a `.env` file to configure your Ottomon instance. The file should include the following variables:

   - `OPENAI_API_KEY`: Your API key for OpenAI.
   - `NEXT_PUBLIC_SUPABASE_URL`: The URL for your Supabase instance (create a new project on Supabase for this purpose).
   - `SUPABASE_SERVICE_ROLE_KEY`: The service role key for your Supabase instance (create a new project on Supabase for this purpose).
   - `JWT_SECRET`: The secret key for signing JWT tokens.
   - `SQL_CONNECTION_STRING`: The connection string for your Supabase database (create a new project on Supabase for this).

3. **Initialize the Database**: Run the following command to initialize the database and set up the necessary tables and data in your Supabase instance.

   ```shell
   npx prisma db push
   ```

4. **Running Ottomon**:

   - Using Docker:

     - Build the Docker image:

       ```shell
       docker build -t ottomon .
       ```

     - Run the Docker container:

       ```shell
       docker run -p 3000:3000 ottomon
       ```

   - Starting Locally:

     - Install dependencies:

       ```shell
       yarn install
       ```

     - Build the application:

       ```shell
       yarn build
       ```

     - Start the Ottomon web application:

       ```shell
       yarn start
       ```

## Contributing

We welcome contributions to Ottomon! If you'd like to contribute, follow these steps:

1. **Fork the Repository**: Start by forking the Ottomon repository to your GitHub account.

2. **Create a New Branch**: Create a new branch for your feature or bug fix (e.g., `feature/my-new-feature`).

3. **Make Your Changes**: Implement your changes within the branch.

4. **Commit Your Changes**: Commit your changes with a descriptive message (e.g., 'Add some feature').

5. **Push to the Branch**: Push your changes to your branch on GitHub.

6. **Create a Pull Request**: Create a new Pull Request to propose your changes for review and inclusion in the Ottomon project.

Ottomon is an exciting GenAI platform, and your contributions can help make it even better!

---

Feel free to adapt and modify this README as needed for your Ottomon project.
