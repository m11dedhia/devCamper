# Dev Camper API
A basic API which serves as the backend for a bootcamp. Contains authentication as well as security middleware


### The API contains the following schemas:
- Bootcamp
- Course
- User
- Review
----
### These are some basic backend rules between Schemas
- One Bootcamp can have __n__ number of Courses.
- One Course can only be associated with one Bootcamp.
- There are three types of users in the model:
  1. __Publisher__ - has the right to create a bootcamp and multiple courses. They cannot add reviews for their courses in their own bootcamp. They can only modify courses and the bootcamp belonging to them.
  2. __User__ - has the right to view all bootcamps and courses under it. User also has the right to add __1__ review per course. User cannot modify course details in any way (add, update or delete).
  3. __Admin__ - Has access to all information and can update everything and everything ranging from deleting an entire bootcamp to deleting a review. Admin access can only be granted through the database which in this case is __MongoDB__.
- __Average Rating__ and __Average Cost__ are updated as and when some change is made to the given bootcamp _i.e_, adding new course, deleting a course and updating details of the course w.r.t _averageCost_ and _averageRating_


----------------------
### All API calls:
#### GET
1. Get all bootcamps : `/api/v1/bootcamps`
2. Get bootcamps by zipcode & distance : `/api/v1/bootcamps/<zipcode>/<radius>`
3. Get single bootcamp : `/api/v1/bootcamps/<bootcampId>`
4. Get all courses : `/api/v1/courses`
5. Get all courses of a particular bootcamp: `/api/v1/<bootcampId>/courses`
6. Get single course : `/api/v1/courses/<courseId>`
7. Get all users : `/api/v1/users`
8. Get single user : `/api/v1/users/<userId>`
9. Get all reviews : `/api/v1/reviews`
10. Get all reviews of a bootcamp : `/api/v1/reviews/<bootcampId>`
11. Get single review : `/api/v1/reviews/<courseId>`

### POST

*Updation still in process*
