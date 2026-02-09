use travel_planner;

insert into `user` (email, password)
values
    ('templates@travelplanner.local', 'TEMPLATE_PASSWORD');

insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template) values 
('USA', 'Chicago', null, null, 'Template: 3-day Chicago itinerary focusing on food, museums, and walking.', 1, true);

insert into trip_day (day_date, day_notes, trip_id) values
    ('2099-01-01', 'Day 1: Downtown + Riverwalk', 1),
    ('2099-01-02', 'Day 2: Museums + neighborhoods', 1),
    ('2099-01-03', 'Day 3: Brunch + lakefront', 1);

insert into activity (trip_day_id, order_index, title, description, location, start_time, end_time, created_by_user_id
) values
    (1, 1, 'Millennium Park', 'Visit Cloud Gate (The Bean) and explore the park.', 'Millennium Park', '10:00', '11:30', 1),
    (1, 2, 'Chicago Riverwalk', 'Walk along the river and grab coffee.', 'Chicago Riverwalk', '12:00', '13:00', 1),
    (1, 3, 'Architecture Boat Tour', 'Classic Chicago architecture tour.', 'Chicago River', '14:00', '15:30', 1),

    (2, 1, 'Art Institute of Chicago', 'Explore museum highlights.', 'Art Institute of Chicago', '10:00', '13:00', 1),
    (2, 2, 'West Loop Lunch', 'Lunch in the West Loop.', 'West Loop', '13:30', '14:30', 1),
    (2, 3, 'Wicker Park Walk', 'Explore shops and cafes.', 'Wicker Park', '16:00', '18:00', 1),

    (3, 1, 'Brunch', 'Relaxed brunch to start the day.', 'Chicago', '10:30', '12:00', 1),
    (3, 2, 'Lakefront Trail', 'Walk along Lake Michigan.', 'Lakefront Trail', '12:30', '14:00', 1);