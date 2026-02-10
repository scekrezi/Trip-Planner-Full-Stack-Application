drop database if exists travel_planner_test;
create database travel_planner_test;
use travel_planner_test;

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
    notes text not null,
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
    created_by_user_id int not null,
    constraint fk_activity_trip_day
        foreign key (trip_day_id) references trip_day(trip_day_id) on delete cascade,
    constraint fk_activity_created_by
        foreign key (created_by_user_id) references `user`(user_id),
    constraint uq_activity_order
        unique (trip_day_id, order_index)
);

delimiter //
create procedure set_known_good_state()
begin
	delete from activity;
    delete from trip_day;
    delete from trip_member;
    delete from trip;
    delete from `user`;

	alter table activity auto_increment = 1;
    alter table trip_day auto_increment = 1;
    alter table trip auto_increment = 1;
    alter table `user` auto_increment = 1;
	
insert into `user` (email, password) values
    ('a@test.com', 'passA'),
    ('b@test.com', 'passB');

insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
    values ('USA', 'Chicago', null, null, 'Template: 3-day Chicago itinerary', 1, true);

insert into trip_day (day_date, day_notes, trip_id) values
    ('2099-01-01', 'Day 1: Downtown', 1),
    ('2099-01-02', 'Day 2: Museums', 1),
    ('2099-01-03', 'Day 3: Lakefront', 1);

insert into activity (trip_day_id, order_index, title, description, location, start_time, end_time, created_by_user_id) values
    (1, 1, 'Millennium Park', 'The Bean + Park', 'Millennium Park', '10:00:00', '11:00:00', 1),
    (1, 2, 'Riverwalk', 'Walk the river', 'Chicago Riverwalk', '12:00:00', '13:00:00', 1),
    (2, 1, 'Art Institute', 'Museum highlights', 'Art Institute of Chicago', '10:00:00', '13:00:00', 1),
    (3, 1, 'Brunch', 'Relaxed brunch', 'Chicago', '10:30:00', '12:00:00', 1);
	
end//
delimiter ;
