# Eventdrive Api

This repository contains the backend APIs for the Event Center Booking Platform. These APIs serve as the backend infrastructure to support the functionality of the platform.

## Technologies Used

- [Nestjs](https://nestjs.com/) - Backend framework for building APIs
- [MongoDB](https://www.mongodb.com/) - Database for storing event center and user data
- [npm](https://www.npmjs.com/) - Package manager for managing dependencies

## API Endpoints

The following are some of the key API endpoints provided by the platform:

- GET /api/event-centers: Retrieve a list of all event centers.
- POST /api/event-centers: Create a new event center.
- GET /api/event-centers/:id: Retrieve details of a specific event center.
- PUT /api/event-centers/:id: Update information for a specific event center.
- DELETE /api/event-centers/:id: Delete a specific event center.
- GET /api/bookings: Retrieve a list of all bookings.
- POST /api/bookings: Create a new booking.
- GET /api/bookings/:id: Retrieve details of a specific booking.
- PUT /api/bookings/:id: Update information for a specific booking.
- DELETE /api/bookings/:id: Delete a specific booking.

## Authentication

The APIs use token-based JwT authentication. To access protected endpoints, include the generated token in the request headers.

## License

This project is licensed under the <b>MIT License</b>.
