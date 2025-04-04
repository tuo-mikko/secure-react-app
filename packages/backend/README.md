How to run backend:

npm install
npm run dev [PASSWORD FOR SERVER]


Currently working requests:

POST api/posts
Use to add a new post to database, required to have an acceptable request BODY with the correct format contents

GET api/posts
Fetch all posts in JSON format
GET api/posts/:id
Fecth a certain post