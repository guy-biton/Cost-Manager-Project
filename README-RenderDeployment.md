# Deploying to Render.com

Render is a fantastc free platform that natively integrates with GitHub. To fulfill the "Deploy four separate processes" requirement, you will create **four independent Web Services** on Render, all pointing to your single GitHub repository!

## Step 1: Push it to GitHub
1. Create a free account at [GitHub](https://github.com/login).
2. Create a new repository on GitHub (you can name it `cost-manager-backend`).
3. Take the code in your `NodejsProject` folder and push it to this repository. *(Reminder: Ensure you don't push the `node_modules` folder!)*

## Step 2: Setup Render
1. Go to [Render](https://dashboard.render.com/register) and sign up using your GitHub account.
2. Once logged in, look at your Render Dashboard and click the **New +** button in the top right, then select **Web Service**.
3. Under "Connect a repository", find the `cost-manager-backend` repository you just created and click **Connect**.

## Step 3: Deploy Service 1 (Logs)
1. **Name**: Type `costmanager-logs`
2. **Region**: Leave as default (e.g. Frankfurt or Ohio)
3. **Branch**: `main`
4. **Runtime**: `Node`
5. **Build Command**: `npm install`
6. **Start Command**: `node logs_service.js`
7. Scroll down to **Environment Variables** and click **Add Environment Variable**:
   - **Key**: `MONGO_URI`
   - **Value**: *(Paste your exact MongoDB Atlas URL from your local `.env` file here)*
8. Click **Create Web Service**. 
*Render will begin building it. Once it's live, copy the URL they give you (it will look like `costmanager-logs.onrender.com`) and paste that link into the Google Form as Link 1!*

## Step 4: Deploy Service 2 (Users)
1. Go back to your Render Dashboard and click **New + -> Web Service** again.
2. Connect the **exact same** GitHub repository.
3. **Name**: Type `costmanager-users`
4. **Build Command**: `npm install`
5. **Start Command**: `node users_service.js`  <-- *(Notice we changed the file!)*
6. **Environment Variables**: Add your `MONGO_URI` key exactly like before!
7. Click **Create Web Service**. Copy the generated URL into Link 2 on the Google Form.

## Step 5: Deploy Service 3 (Costs)
1. Dashboard -> **New + -> Web Service**.
2. Connect your repository.
3. **Name**: Type `costmanager-costs`
4. **Build Command**: `npm install`
5. **Start Command**: `node costs_service.js` <-- *(Changed again!)*
6. **Environment Variables**: Add your `MONGO_URI` key.
7. Click **Create Web Service**. Copy the generated URL into Link 3 on the Google Form.

## Step 6: Deploy Service 4 (About/Admin)
1. Dashboard -> **New + -> Web Service**.
2. Connect your repository.
3. **Name**: Type `costmanager-about`
4. **Build Command**: `npm install`
5. **Start Command**: `node about_service.js` <-- *(Final change!)*
6. **Environment Variables**: For this one, you do NOT need `MONGO_URI`. Instead, add the variables for your developer names!
   - **Key**: `TEAM_MEMBER_1_FIRST` | **Value**: `YourFirstName`
   - **Key**: `TEAM_MEMBER_1_LAST` | **Value**: `YourLastName`
   - **Key**: `TEAM_MEMBER_2_FIRST` | **Value**: `PartnerFirstName`
   - **Key**: `TEAM_MEMBER_2_LAST` | **Value**: `PartnerLastName`
7. Click **Create Web Service**. Copy the generated URL into Link 4 on the Google Form.

### Success!
Once all 4 apps have a green "Live" status on Render, your assignment is fully hosted on the internet! 

You can test them by replacing the `a, b, c, d` variables in your teacher's Python script tightly with your brand new `.onrender.com` URLs!
