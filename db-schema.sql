
-- USERS
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" TEXT NOT NULL,
  "avatar_url" TEXT,
  "bio" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MOVIES
CREATE TABLE "movies" (
  "id" SERIAL PRIMARY KEY,
  "external_id" VARCHAR(255) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "original_title" VARCHAR(255),
  "release_year" INT,
  "genre" VARCHAR(255),
  "description" TEXT,
  "poster_url" TEXT,
  "runtime" INT,
  "language" VARCHAR(50),
  "country" VARCHAR(100),
  "rating_avg" FLOAT,
  "rating_count" INT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_external_id UNIQUE (external_id)
);

-- GROUPS
CREATE TABLE "groups" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "avatar_url" TEXT,
  "owner_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_groups_owner FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- GROUP MEMBERS
CREATE TABLE "group_members" (
  "user_id" INTEGER NOT NULL,
  "group_id" INTEGER NOT NULL,
  "role" VARCHAR(50) DEFAULT 'member',
  "joined_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "group_id"),
  CONSTRAINT fk_groupmembers_user FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_groupmembers_group FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE
);

-- GROUP INVITATIONS
CREATE TABLE group_invitations (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
  invited_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  invited_by_user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- RATINGS
CREATE TABLE "ratings" (
  "user_id" INTEGER NOT NULL,
  "movie_id" INTEGER NOT NULL,
  "rating" INTEGER NOT NULL,
  "review" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "movie_id"),
  CONSTRAINT fk_ratings_user FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_ratings_movie FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE
);

-- LISTS
CREATE TABLE "lists" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "owner_user_id" INTEGER,
  "owner_group_id" INTEGER,
  "is_public" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lists_user FOREIGN KEY ("owner_user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_lists_group FOREIGN KEY ("owner_group_id") REFERENCES "groups" ("id") ON DELETE CASCADE
);

-- LIST_MOVIES (many-to-many)
CREATE TABLE "list_movies" (
  "list_id" INTEGER NOT NULL,
  "movie_id" INTEGER NOT NULL,
  "added_by_user_id" INTEGER NOT NULL,
  "added_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("list_id", "movie_id"),
  CONSTRAINT fk_listmovies_list FOREIGN KEY ("list_id") REFERENCES "lists" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_listmovies_movie FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_listmovies_user FOREIGN KEY ("added_by_user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "movie_id" INTEGER,
  "list_id" INTEGER,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_user FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_comments_movie FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_comments_list FOREIGN KEY ("list_id") REFERENCES "lists" ("id") ON DELETE CASCADE
);



CREATE INDEX idx_movies_external_id ON movies (external_id);
CREATE INDEX idx_ratings_user_id ON ratings (user_id);
CREATE INDEX idx_ratings_movie_id ON ratings (movie_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
CREATE INDEX idx_comments_movie_id ON comments (movie_id);
CREATE INDEX idx_comments_list_id ON comments (list_id);
CREATE INDEX idx_lists_user_id ON lists (owner_user_id);
CREATE INDEX idx_lists_group_id ON lists (owner_group_id);

