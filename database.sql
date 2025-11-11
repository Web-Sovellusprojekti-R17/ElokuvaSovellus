CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE "Group" (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL
);

CREATE TYPE role_enum AS ENUM ('Admin', 'Member', 'Pending');

CREATE TABLE Member (
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    role role_enum NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES "Group"(group_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
        ON DELETE CASCADE
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES "Group"(group_id)
        ON DELETE CASCADE
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    review TEXT,
    rating INT CHECK (rating >= 0 AND rating <= 5),
    FOREIGN KEY (user_id) REFERENCES "User"(user_id)
        ON DELETE CASCADE
);
