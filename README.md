# GameScope

GameScope is a web application developed with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8. It serves as a social gaming platform that allows users to manage their personal video game collections, interact with others through reviews and comments, and receive notifications about various activities.

## Key Features

- **Collection Management**: Users can add, edit, and delete games from their personal collection.
- **User Reviews**: Users can write reviews for games, sharing their opinions and experiences.
- **Commenting System**: Users can comment on game reviews, facilitating discussions and interactions.
- **Rating System**: A karma-based system enables users to rate reviews and comments, promoting quality contributions.
- **Notifications**: Users receive notifications about interactions, such as comments on their reviews or replies to their comments.

## Technologies Used

- **Frontend**: Angular
- **Backend**: [Spring Boot API](https://github.com/EduardoMango/GameScopeAPI)

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/EduardoMango/GameScope.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd GameScope
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200/`.

## Development Server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code Generation

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Backend Integration

The application relies on a backend API developed with Spring Boot. For more information and setup instructions, please refer to the [GameScopeAPI repository](https://github.com/EduardoMango/GameScopeAPI).

## Contributions

Contributions are welcome.

## License

This project is licensed under the MIT License.

---
