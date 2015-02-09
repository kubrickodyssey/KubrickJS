DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id                          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username                    VARCHAR(50),
    password                    VARCHAR(50)
);

INSERT INTO users 
    SET username = "jahenn", 
        password = "12345";