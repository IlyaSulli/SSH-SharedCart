# SSH-SharedCart

**NOTE**: This project was an assigned university task set by The University of Birmingham to test our ability to work as a team to complete a project. This project tested our skills to design an Engineering Design Review, build the project designed and to reflect on our piers to see what they did well and ways that they could have improved.

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
- **20/11/2024**: The frontend design built using HTML and CSS for the cart was approved. Javascript was needed and the cart features was slowed down until the server APIs were designed in order to have test data.
- **25/11/2024**: A meeting was done where we talked about switching systems to node.js for the server. We found that the postgresql was not adequite for the capabilities we needed it for
- **03/12/2024**: A meeting was done where we talked about preparations to merge the server and the website. We began refactoring the backend server code base to make it more in line with what Node.js expects and added additional comments for further clarification
- **05/12/2024**: Refactored the backend for the cart page as well as implemented APIs
- **06/12/2024**: Merged the server and the website and began tests on the cart to ensure it worked
- **09/12/2024**: Made it so the server side of the program could be run in Docker with the contianer stored on the GitHub Repo
- **09/12/2024**: A meeting was commenced to fix bugs and to talk about the reflections with what we did.
