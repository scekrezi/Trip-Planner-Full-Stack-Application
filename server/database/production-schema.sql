drop database if exists travel_planner;
create database travel_planner;
use travel_planner;

create table `user` (
    user_id int primary key auto_increment,
    email varchar(255) not null unique,
    password varchar(255) not null
);

create table trip (
    trip_id int primary key auto_increment,
    country varchar(100) not null,
    city varchar(100) not null,
    start_date date null,
    end_date date null,
    notes text null,
    owner_user_id int not null,
    is_template boolean not null default false,
    constraint fk_trip_owner
        foreign key (owner_user_id) references `user`(user_id)
);

create table trip_member (
    trip_id int not null,
    user_id int not null,
    role varchar(10) not null,
    primary key (trip_id, user_id),
    constraint fk_trip_member_trip
        foreign key (trip_id) references trip(trip_id) on delete cascade,
    constraint fk_trip_member_user
        foreign key (user_id) references `user`(user_id) on delete cascade
);

create table trip_day (
    trip_day_id int primary key auto_increment,
    day_date date not null,
    day_notes text null,
    trip_id int not null,
    constraint fk_trip_day_trip
        foreign key (trip_id) references trip(trip_id) on delete cascade,
    constraint uq_trip_day
        unique (trip_id, day_date)
);

create table activity (
    activity_id int primary key auto_increment,
    trip_day_id int not null,
    order_index int not null,
    title varchar(150) not null,
    description text null,
    location varchar(255) null,
    start_time time null,
    end_time time null,
    created_by_user_id int null,
    constraint fk_activity_trip_day
        foreign key (trip_day_id) references trip_day(trip_day_id) on delete cascade,
    constraint fk_activity_created_by
        foreign key (created_by_user_id) references `user`(user_id),
    constraint uq_activity_order
        unique (trip_day_id, order_index)
);
