# Home Library Service

## Prerequisites

-   Git - [Download & Install Git](https://git-scm.com/downloads).
-   Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```shell
git clone git@github.com:TheLevius/node-home-library-service.git
```

## Checkout on task branch

```shell
git checkout task-8-logging-authentication
```

## Rename `.env.example` to `.env`

## Docker

```shell
docker-compose up --build
```

## Testing

```shell
npm install // test framework dependencies
```

After application running open new terminal and enter:

```shell
npm run test:auth
```

Если выдает ошибки (`socket hang up`);
просто надо остановить container `app` (база пусть работает, с миграциями должно быть все ок)
и запустить приложение без докера

```shell
docker stop app
npm run start:dev
```

и потом снова запустить тесты

```shell
npm run test:auth
```

**Details:**

1. For `Users`, `Artists`, `Albums`, `Tracks` and `Favorites` REST endpoints with separate router paths should be created

-   `Users` (`/user` route)

    -   `GET /user` - get all users
        -   Server should answer with `status code` **200** and all users records
    -   `GET /user/:id` - get single user by id
        -   Server should answer with `status code` **200** and and record with `id === userId` if it exists
        -   Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    -   `POST /user` - create user (following DTO should be used)
        `CreateUserDto`

        ```typescript
        interface CreateUserDto {
            login: string;
            password: string;
        }
        ```

        -   Server should answer with `status code` **201** and newly created record if request is valid
        -   Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields

    -   `PUT /user/:id` - update user's password
        `UpdatePasswordDto` (with attributes):

        ```typescript
        interface UpdatePasswordDto {
            oldPassword: string; // previous password
            newPassword: string; // new password
        }
        ```

        -   Server should answer with`status code` **200** and updated record if request is valid
        -   Server should answer with`status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -   Server should answer with`status code` **404** and corresponding message if record with `id === userId` doesn't exist
        -   Server should answer with`status code` **403** and corresponding message if `oldPassword` is wrong

    -   `DELETE /user/:id` - delete user
        -   Server should answer with `status code` **204** if the record is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

-   `Tracks` (`/track` route)

    -   `GET /track` - get all tracks
        -   Server should answer with `status code` **200** and all tracks records
    -   `GET /track/:id` - get single track by id
        -   Server should answer with `status code` **200** and and record with `id === trackId` if it exists
        -   Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === trackId` doesn't exist
    -   `POST /track` - create new track
        -   Server should answer with `status code` **201** and newly created record if request is valid
        -   Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    -   `PUT /track/:id` - update track info
        -   Server should answer with`status code` **200** and updated record if request is valid
        -   Server should answer with`status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
        -   Server should answer with`status code` **404** and corresponding message if record with `id === trackId` doesn't exist
    -   `DELETE /track/:id` - delete track
        -   Server should answer with `status code` **204** if the record is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === trackId` doesn't exist

-   `Artists` (`/artist` route)

    -   `GET /artist` - get all artists
        -   Server should answer with `status code` **200** and all artists records
    -   `GET /artist/:id` - get single artist by id
        -   Server should answer with `status code` **200** and and record with `id === artistId` if it exists
        -   Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === artistId` doesn't exist
    -   `POST /artist` - create new artist
        -   Server should answer with `status code` **201** and newly created record if request is valid
        -   Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    -   `PUT /artist/:id` - update artist info
        -   Server should answer with`status code` **200** and updated record if request is valid
        -   Server should answer with`status code` **400** and corresponding message if `artist` is invalid (not `uuid`)
        -   Server should answer with`status code` **404** and corresponding message if record with `id === artistId` doesn't exist
    -   `DELETE /artist/:id` - delete album
        -   Server should answer with `status code` **204** if the record is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === artistId` doesn't exist

-   `Albums` (`/album` route)

    -   `GET /album` - get all albums
        -   Server should answer with `status code` **200** and all albums records
    -   `GET /album/:id` - get single album by id
        -   Server should answer with `status code` **200** and and record with `id === albumId` if it exists
        -   Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === albumId` doesn't exist
    -   `POST /album` - create new album
        -   Server should answer with `status code` **201** and newly created record if request is valid
        -   Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    -   `PUT /album/:id` - update album info
        -   Server should answer with`status code` **200** and updated record if request is valid
        -   Server should answer with`status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
        -   Server should answer with`status code` **404** and corresponding message if record with `id === albumId` doesn't exist
    -   `DELETE /album/:id` - delete album
        -   Server should answer with `status code` **204** if the record is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if record with `id === albumId` doesn't exist

-   `Favorites`

    -   `GET /favs` - get all favorites

        -   Server should answer with `status code` **200** and all favorite records (**not their ids**), split by entity type:

        ```typescript
        interface FavoritesResponse {
            artists: Artist[];
            albums: Album[];
            tracks: Track[];
        }
        ```

    -   `POST /favs/track/:id` - add track to the favorites
        -   Server should answer with `status code` **201** and corresponding message if track with `id === trackId` exists
        -   Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
        -   Server should answer with `status code` **422** and corresponding message if track with `id === trackId` doesn't exist
    -   `DELETE /favs/track/:id` - delete track from favorites
        -   Server should answer with `status code` **204** if the track was in favorites and now it's deleted id is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if corresponding track is not favorite
    -   `POST /favs/album/:id` - add album to the favorites
        -   Server should answer with `status code` **201** and corresponding message if album with `id === albumId` exists
        -   Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
        -   Server should answer with `status code` **422** and corresponding message if album with `id === albumId` doesn't exist
    -   `DELETE /favs/album/:id` - delete album from favorites
        -   Server should answer with `status code` **204** if the album was in favorites and now it's deleted id is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if corresponding album is not favorite
    -   `POST /favs/artist/:id` - add artist to the favorites
        -   Server should answer with `status code` **201** and corresponding message if artist with `id === artistId` exists
        -   Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
        -   Server should answer with `status code` **422** and corresponding message if artist with `id === artistId` doesn't exist
    -   `DELETE /favs/artist/:id` - delete artist from favorites
        -   Server should answer with `status code` **204** if the artist was in favorites and now it's deleted id is found and deleted
        -   Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
        -   Server should answer with `status code` **404** and corresponding message if corresponding artist is not favorite
