# MongoDB Atlas Setup Instructions

This guide provides step-by-step instructions on how to set up your MongoDB Atlas cluster for the Cost Manager project and connect it to your application.

## 1. Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Sign up for a new account or log in if you already have one.

## 2. Deploy a Free Cluster
1. Once logged in, click on **Build a Database** in the Atlas dashboard.
2. Select the **Shared** (Free) tier and click **Create**.
3. Choose a cloud provider (e.g., AWS, GCP, or Azure) and a region closest to you.
4. Under "Cluster Name", you can leave it as `Cluster0` or name it something like `CostManagerCluster`.
5. Click **Create**. It may take a few minutes for the cluster to be provisioned.

## 3. Configure Database Security
Before you can connect to your database, you need to set up credentials and network access.
1. **Create a Database User**: 
   - Under "Security Quickstart" or the "Database Access" tab on the left menu, click **Add New Database User**.
   - Choose **Password** for authentication.
   - Enter a **Username** (e.g., `admin`) and a **Password**. *Save this password securely; you will need it later.*
   - Grant the user **Read and write to any database** privileges.
   - Click **Add User**.
2. **Whitelist Your IP Address**:
   - Go to the **Network Access** tab on the left menu.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (which inserts `0.0.0.0/0`). This will allow your deployed cloud processes to access the database without IP whitelist issues.
   - Click **Confirm**.

## 4. Get Your Connection String
1. Go to the **Database** tab on the left menu.
2. Click the **Connect** button next to your cluster.
3. Select **Drivers** (since we are using Node.js/Express).
4. Select **Node.js** as your driver and choose the latest version.
5. Copy the connection string provided. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 5. Configure Your Application
1. In your Node.js project directory, make sure you install Mongoose:
   ```bash
   npm install mongoose dotenv
   ```
2. Create a `.env` file in the root of your project.
3. Add your connection string to the `.env` file. **Make sure to replace `<username>` and `<password>` with the credentials you created in Step 3!**
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cost_manager?retryWrites=true&w=majority
   ```
   *(Notice that we added `cost_manager` right before the `?` to specify the default database name).*
4. In your code, load the `.env` file and connect using Mongoose.

## 6. Creating Collections & The Test User in Atlas

For your final submission, your collections need to exist but must be empty except for one test user in `users`.

**Step-by-step instructions in the MongoDB Atlas Web Application:**
1. Go to your cluster in Atlas and click **Browse Collections**.
2. Click **Add My Own Data** (or **Create Database**).
3. Under **Database Name**, enter `cost_manager`.
4. Under **Collection Name**, enter `users`, and click **Create**.
5. Click the **+ Create Collection** button (look for the "plus" icon next to your database name) and add two more collections: `costs` and `logs`.
6. Go back to your `users` collection and click **Insert Document**.
7. Delete the auto-generated `{ "_id": ... }` line (or leave the `_id` field if it forces you, but make sure to add the required properties). Since Mongoose usually handles `_id`, you can click the `{}` icon to view it as plain JSON and paste this exact structure:

```json
{
  "id": 123123,
  "first_name": "mosh",
  "last_name": "israeli"
}
```
8. Click **Insert**. Your database is now perfectly prepped for final submission testing!
