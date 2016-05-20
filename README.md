---
services: active-directory
platforms: nodejs
author: danielxu-msft
---

# Node.js App-Only sample for Microsoft Graph

## About this sample
This Node.js sample application demonstrates how to Read and Write AAD users in tenant of Microsoft Azure Active Directory with using the Microsoft Graph API, which is a new RESTful interface that allows programmatic access to AAD user data in tenant. The Graph API is now GA. Graph service enables developers to incorporate new capabilities with existing applications and to build new applications that leverage directory data access to Microsoft Azure AD.

Please refer to [AAD Graph team blog](http://blogs.msdn.com/b/aadgraphteam/) on MSDN to learn more about Microsoft Azure Active Directory Graph Service.

This sample performs HTTP requests and reads JSON format responses from Graph service. More details about HTTP requests and JSON responses from Graph service, please refer to [http://blogs.msdn.com/b/aadgraphteam/archive/2013/01/15/understanding-azure-active-directory-graph-operations.aspx](http://blogs.msdn.com/b/aadgraphteam/archive/2013/01/15/understanding-azure-active-directory-graph-operations.aspx).

The main logic code in this sample is written in **routes/api.js**, **helpers/auth.js** files.

The **auth.js**  file contains the code for authentication from Microsoft Graph service.

The **api.js** file contains the code which builds the request for involving the Graph REST APIs..

- `connect` function demonstrates how to apply for an access token from Microsoft Graph and save it in session.
- `get user` function demonstrates how to query all users' (or specific user with user's id) info in tenant and list them on the page.
- `post user` function demonstrates how to create a new user in tenant.
- `patch user` function demonstrates how to update a user's info in tenant.
- `delete user` function demonstrates how to delete a user in tenant.

You can refer to [Graph REST API reference](http://graph.microsoft.io/en-us/docs/api-reference/v1.0/resources/user) to understand more details.

The Graph API is compatible with OData V3 and enables applications to construct more complex queries. The sample application is authenticated with Graph API by presenting a token that is issued by Microsoft Azure Access Control Service using OAuth 2.0. The sample application is authorized in [Service to Service Calls Using Client Credentials](https://msdn.microsoft.com/en-us/library/azure/dn645543.aspx?f=255&MSPPError=-2147217396) flow to read user information from a demonstration Azure AD company. To execute Write Operations for your company's data (Create, Delete, Update), it's required to use your own Azure AD company and upgrade the role of the AD application that you are using with an administrator permission (the PowerShell script shown as below is guiding us to know how to do it).

```
#use the administrator account to sign in
    Connect-MsolService
    $ClientIdWebApp = '{your_AD_application_client_id}'
    $webApp = Get-MsolServicePrincipal -AppPrincipalId $ClientIdWebApp
#use Add-MsolRoleMember to add it to "Company Administrator" role).
    Add-MsolRoleMember -RoleName "Company Administrator" -RoleMemberType ServicePrincipal -RoleMemberObjectId $webApp.ObjectId
```

## Building the sample

### Option 1: Use Visual Studio 2015
- Before running this code sample, please open **helpers/config.js** in the directory.

    Here it's needed to use tenant ID, client ID and secret key for setting up a correct configuration. Login [Azure Manage Portal](https://manage.windowsazure.com/), click the **ACTIVE DIRECTORY** on the left navigation bar, find your AD tenant on the right side list.

    ![Find your AD tenant on the right side list](./Images/1.png)


- Replace **ENTER_YOUR_TENANT_ID** with your Azure AD tenant ID in **config.js**.

    Click the **APPLICATIONS** button on the top navigation bar. Find the **VIEW ENDPOINTS** at bottom, get something like xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

    ![Replace ENTER_YOUR_TENANT_ID with your Azure AD tenant ID](./Images/2.png)

- Replace **ENTER_YOUR_CLIENT_ID** with the client ID of your registered Azure application in **config.js**.

    Click the application name you will use in the list. Then click the **CONFIGURE** tab at top. Under the **properties** section, get the **CLIENT ID**.

    ![Replace ENTER_YOUR_CLIENT_ID with the client ID of your registered Azure application](./Images/3.png)

- In **config.js**, replace **ENTER_YOUR_SECRET** with a key generated on the **Configure** page of your app in the Microsoft Azure Management Portal.

    Scroll down to the **key** section. Select an option of the Select duration select, click the **SAVE** button on the bottom. After AD saved configurations, you can get the secret key.

    ![replace ENTER_YOUR_SECRET with a key generated on the Configure page of your app](./Images/4.png)

- Right click the **npm** section under the solution, click **Update npm Packages** to install the dependencies required.

    ![click Update npm Packages to install the dependencies required](./Images/npmUpdate.PNG)
- Then you can press **F5** to run the sample in Visual Studio.

### Option 2: Use your other favorite IDEs to modify the scripts and use node.js command to run the sample
- Modify the configurations of AAD (via the same steps method above) in **config.js**.
- Install dependencies via **package.json** by running `npm install`.
- Start the server by running `npm start`.
- Navigate to http://127.0.0.1:1337/ in your web browser.

## Tour the sample
- Click the **connect** button in the home page to get the access token from Microsoft Graph.

![Click the connect button](./Images/5.png)

- Click the **User Manager** button on the top nav bar to redirect to the page that contains the users' list.

![Click the User Manager button](./Images/6.png)

- Perform CURD operations for these users' info.
    - Add user
        ![Add user](./Images/7.png)

    - Edit user
        ![Edit user](./Images/8.png)

- Click the **disconnect** button in the home page to remove the access token cookies.

    ![Click the disconnect button in the home page to remove the access token cookies](./Images/9.png)

## More information
- Overview of Microsoft Graph: [http://graph.microsoft.io/en-us/docs/overview/overview](http://graph.microsoft.io/en-us/docs/overview/overview)
- Microsoft Azure Active Directory GitHub repository:
[https://github.com/AzureAD](https://github.com/AzureAD)
- Node.js web app frramwork, Express: [http://expressjs.com](http://expressjs.com)
- Node.js Simplified HTTP client: [https://github.com/request/request](https://github.com/request/request)
- Azure MEAN App sample: [https://github.com/prashanthmadi/Azure-MEAN-APP](https://github.com/prashanthmadi/Azure-MEAN-APP)
