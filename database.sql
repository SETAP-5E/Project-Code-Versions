CREATE DATABASE RACKET;

CREATE TABLE player (
    player_id SERIAL PRIMARY KEY,
    player_name varchar(50),
    player_email VARCHAR(50),
    player_number int,
    player_gender VARCHAR(1)
);

create table results (
    player_id SERIAL PRIMARY KEY,
    wins INTEGER
);

CREATE TABLE bookings( 
    booking_id SERIAL PRIMARY KEY,
    court_id SERIAL,
    player_id SERIAL,
    match_date DATE,
    match_time TIME
);

CREATE TABLE court(
    court_id SERIAL PRIMARY KEY,
    court_location VARCHAR(50),
    court_description varchar(50)
);


