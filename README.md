
![ssh-banner](https://github.com/user-attachments/assets/24d47dd9-497d-42b0-a264-3376dda26f29)
# Student Smart Homes - Shared Cart


> **NOTE**: This project was an assigned university task set by The University of Birmingham to test our ability to work as a team to complete a project. This project tested our skills to design an Engineering Design Review, build the project designed and to reflect on our piers to see what they did well and ways that they could have improved.

**Assigned Work**

- [Ilya](https://github.com/IlyaSulli) : Website - Cart page
- [Sultan](https://github.com/Rokkema) : Website - Shopping page
- [Hector](https://github.com/Hector-Warner) : Server - Cart
- [Coll](https://github.com/cdmacc) : Server - Shopping

**Languages Used**:

- Frontend:
  - HTML
  - CSS
  - JS
- Backend:
  - JavaScript
  - Node.js
  - MongoDB (Mongoose)
 
## Problem

In some student houses, students use grocery delivery services to have groceries delivered to their house. To save on delivery fees, all participating students in the house may place orders together. This project is to extend SSH Console Table and SSH App with the ability to add items to a shared order for the next delivery. Student Smart Homes has partnered with several supermarkets that provide information about available products along with their current prices that can be searched and added to the order. Prices may change over time as promotions come and go or the base price of a product changes. The students should be able to view the items in the order at any time, including who added what, what the total cost is, and the total cost of all items for each individual member of the house is.

## Timeline

- **18/11/2024**: A meeting was adjourned to discuss the tasks and the languages needed to start the project, including discussing who will be working on which parts of the project in order to best suit our points of expertise. It was planned that we would meet every week to disucss the direction of the project and to talk about changes made. It was set that Ilya and Sultan would work on the frontend and Hector and Coll would work on the backend for the timebeing
- **19/11/2024**: The frontend concept was design and approved by the team, allowing work to begin for the frontend team. The work was split into two different parts, Sultan working on the shopping page whilst Ilya worked on the cart page
- **25/11/2024**: A meeting was done where we talked about switching systems to node.js for the server. We found that the postgresql was not adequite for the capabilities we needed it for
- **03/12/2024**: A meeting was done where we talked about preparations to merge the server and the website. We began refactoring the backend server code base to make it more in line with what Node.js expects and added additional comments for further clarification
- **05/12/2024**: Refactored the backend for the cart page as well as implemented APIs
- **06/12/2024**: Merged the server and the website and began tests on the cart to ensure it worked
- **06/12/2024**: Emergency meeting with the merge to fix major problem with connecting the server to the website.
- **09/12/2024**: Made it so the server side of the program could be run in Docker with the contianer stored on the GitHub Repo
- **09/12/2024**: A meeting was commenced to fix bugs and to talk about the reflections with what we did.
- **10/12/2024**: A final meeting was done to talk about the report, informing each other exactly what we did and breaking down the specifications of what needed to be reported

## Project Report

Our team chose to implement the Student Smart Homes project for allowing students in the same household order from a supermarket together and split the costs. We specifically chose to follow the implementation detailed in Coll MacCulloch’s EDR. We chose his EDR since it seemed to be the easiest to follow, with clear instructions and suitable milestones. In the end, we implemented sample databases with dummy data from multiple supermarkets, and created a front-end which sent and handled API calls.

To do so, we did need to make some changes to the EDR. Primarily, the EDR was lacking in technical content. And so, during our first meeting, we filled in the blanks from the EDR, including the actual database design, a choice for implementing the database, and a way to connect the front- and back-ends.  We chose not to implement a lifespan system, as this would depend on the user data. We also didn’t feel it was necessary to include spelling checks or sorting in the search feature to validate it as a prototype. However, with these changes, we have shown that all the key features of the EDR work successfully in a basic system, outside of user data. These key features being selecting supermarkets, searching the database, and checking out. This gives us evidence that the design could be moved on beyond a prototype. Especially with the inclusion of scalable features already, such as the choice of database being MongoDB.

This was also when we decided how we split our team. Given that Sultan and Ilya had experience working in front-end design, they chose to split that task between them. Hector and Coll felt the experience of working with postgres during our first year equipped them with the necessary skills to tackle that task, and so opted to do so. We then further split ourselves into either working on the Shopping page or the Cart page. Therefore, each member of the team would be working on a single half of one page, clearly defining our roles. We felt this gave us a comfortable and manageable task load to handle, and provided clear direction on whom to ask when a problem occurred. This meeting was followed by weekly meetings to review what progress was made and decide what our immediate plans were.

To keep track of our tasks, we created github issues for each one with rigorous formatting to easily tell at a glance the priority of each task, which milestone it belonged to, and who was responsible for it. We also used the built-in Kanban Board in github to maintain a steady flow of progress and was invaluable in giving us an intuition of how far along we were on the project.

Github and Git were also the obvious choice for version control. We used multiple branches, with each team (front-end and back-end) using their own. They were worked on separately, until they were merged into an additional branch to ensure that they worked together. Once that was verified, that branch was merged to main. We decided against using any build automation tools, having initially considered them, we ended up using Node.js for the back-end and vanilla JavaScript for the front-end. However, we did have some frameworks to save on writing time. For example, Ilya provided the team with the framework used in both the front-end design and JavaScript.

We used NPM for dependency management. Two of the most important being Mongoose and Express which provide a way to write schemas and middleware for our API calls respectively.

To begin, the front-end team worked on creating and then implementing a static design, which went by very smoothly aided by Ilya’s experience in front-end design. There was a small hiccup early on with the back-end team when they decided that they were not entirely comfortable using postgres and gradle. Because of this, we pivoted the project into a Node.js project using MongoDB as our database. This was chosen because of Sultan’s prior knowledge having worked with it before. This proved to be much more suitable for the specifications of the project, as well as the working styles of the back-end team, since it provided for even easier division of labour.

With testing, we chose against using github workflows to create unit tests. This was partly due to our lack of experience in doing so, and partly due to knowing how to use other testing tools. One of the most utilized was Postman, a tool for testing API calls. Its ease of use and excellent versatility made it perfect to use alongside our development. Since it would have taken more of our time to learn how to use unit testing, and given that we were already using tools which we had taken the time to learn, we decided it wasn’t the best use of our time to try to do so.

In order to allow users to run the server with ease, a dockerfile was created that runs the server through a single command. This file uses Node.js as the base image and copies all the source code from the working directory, building the application by installing the correct dependencies using npm. It then configures the container to expose the required port that is used to listen for requests and then when it is run, it executes the server.js file using Node.js. By using a docker container, it allows the server to connect to the database and accept API requests, operating with little issue and allowing for updates to be pushed to every machine that is running this server without the user needing coding knowledge. A Github workflow was made to automate the creation and publishing of the docker container to Github Container Registry (GHCR), streamlining the development and deployment pipeline.

Towards the end of the project, we implemented a system to log all the API Calls enhancing Observability and creating a recorded history of user interactions. This was achieved through introducing a new MongoDB collection that stores both the timestamp of each API call as well as a string representing the API Call with relevant data (“/getCart/getCartCount/?6749ae96930928d87b893bf9”). To further enhance Observability, we created a new router within Express and Node.js to handle these logs. This router retrieves the data from this new collection and stores it within a JSON file to make it easier to monitor and analyse system activity.


## Gallery

### Shopping
![Screenshot 2024-12-11 122821](https://github.com/user-attachments/assets/9ac0ad6d-b175-45db-abe4-c52f0e55a9ee)
![Screenshot 2024-12-11 122716](https://github.com/user-attachments/assets/9af27a0f-4b0b-40cf-aaa5-56d143567267)
![Screenshot 2024-12-11 122728](https://github.com/user-attachments/assets/98723ce9-822e-4f52-849b-5956d6ec14a7)
![Screenshot 2024-12-11 125421](https://github.com/user-attachments/assets/5ea661f8-8ae8-419d-a050-b7564bc9ad87)
![Screenshot 2024-12-11 122738](https://github.com/user-attachments/assets/56d56452-afa2-4a11-a205-3a6c4352d194)

### Cart
![Screenshot 2024-12-11 122832](https://github.com/user-attachments/assets/49e81e1b-0eba-464a-a417-5c0961063c8e)
![Screenshot 2024-12-11 124149](https://github.com/user-attachments/assets/c1ae71f3-33c2-4e42-b5c8-98e448d3711a)
![Screenshot 2024-12-11 124210](https://github.com/user-attachments/assets/2f5c07ef-8bcf-41d7-955e-098f8183c753)
