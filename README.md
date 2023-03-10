# Museum-REST-API

<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h1 align="center">Museums in Sweden</h1>

</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#the-team">The Team</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
      <li><a href="DBeaver-setup">DBeaver Setup</a></li>
      <li><a href="Postman-setup">Postman Setup</a></li>
      <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Final project for the API development course is a group assignment to build a review site that lists which businesses are located in various cities where visitors can read some information about the business. Our group chose to write about 10 museums in Sweden.

### Built With

This is the tech stack used for this project:

- [JavaScript](https://www.javascript.com/)
- [Express](https://expressjs.com/)
- [SQLlite](https://www.sqlite.org/)
- [Sequelize](https://sequelize.org/)
- [Postman](https://www.postman.com/)
- [Dbeaver](https://dbeaver.io/)

## The Team

The team that built this consisted of the following members.

#### Adam Stuborn

- [LinkedIn](https://www.linkedin.com/in/adam-stuborn-8b61a524b/)
- [Github](https://github.com/Stuuben)

#### Barbora Miklosovicova

- [LinkedIn](https://www.linkedin.com/in/barbora-miklosovicova-37937714b/)
- [Github](https://github.com/BarboraMiklosovicova)

#### Fannie Wallner

- [LinkedIn](https://www.linkedin.com/in/fannie-wallner-87635b239/)
- [Github](https://github.com/fanniewallner)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### DBeaver Setup

Go to [DBeaver](https://dbeaver.io/) and sign in.

1. Create a new database connection
2. Choose SQLite as your database option
3. Create a path by choosing the file museum.sqlite

### Postman Setup

Go to [Postman](https://www.postman.com/) and sign in.

1. Import the document from assets map (Museum REST API.postman_collection.json) <a href="/src/assets/Museum-REST-API.postman_collection1.json">Click here!</a>
2. Open the collection Museum REST API
3. Use the following user logins to send requests in Postman

   User Password Email Role
   ("admin", "password123", "admin@admin.com", "admin"),  
   ("owner", "password123", "owner@owner.com", "owner"),  
   ("user", "password123", "user@user.com", "user"),  
   ("user2", "password123", "user2@user.com", "user")

Admin = Can access all requests. <br>
Owner = Has the same access as admin except they can not handle users or delete reviews. <br>
User = Can not delete cities, museums or users. Can only delete their own reviews and their own account. Can search for cities, museums and reviews but can't search for other users.

4. When sending request for getAllMuseums you can use queries limit and city to find museums in a particular city.
   Ex. https:localhost:3000/api/v1/museums/?city=Stockholm&limit=2

When sending request for getAllReviews you can use queries limit and museum to find reviews for a particular museum.
Ex. https:localhost:3000/api/v1/reviews?museum=ABBA+Museet

The getAllCities query has a limit of 10 but can be changed when querying i Postman, however we only have three cities in our mock data.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Stuuben/Museum-REST-API
   ```
2. Install NPM packages for the backend
   ```sh
   npm install
   ```
3. Create .env file in the root directory and add the credentials
   ```bash
   JWT_SECRET=secret
   PORT=3000
   ```

### Design

<img src="./src/assets/databas-design.png" alt="design">
