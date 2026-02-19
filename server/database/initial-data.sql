use travel_planner;

insert into `user` (email, password) values
    ('admin@travel.com', 'password'),
    ('collab@travel.com', 'password');


-- Ensure admin user exists (optional)
-- insert ignore into `user` (user_id, email, password) values (1, 'admin@travel.com', 'password');

-- ================
-- JAPAN (Tokyo) - 4-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Japan', 'Tokyo', null, null, 'Template: 4-day Tokyo starter itinerary (food, neighborhoods, culture).', 1, true);
set @trip_japan := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-01-01', 'Day 1: Shinjuku + nightlife', @trip_japan),
('2099-01-02', 'Day 2: Asakusa + Skytree', @trip_japan),
('2099-01-03', 'Day 3: Shibuya + Harajuku', @trip_japan),
('2099-01-04', 'Day 4: Tsukiji + Ginza', @trip_japan);

-- Day 1
set @d := (select trip_day_id from trip_day where trip_id=@trip_japan and day_date='2099-01-01');
insert into activity (trip_day_id, order_index, title, description, location, start_time, end_time, created_by_user_id) values
(@d, 1, 'Check-in + convenience store run', 'Grab snacks + Suica/PASMO setup.', 'Shinjuku', '15:00', '16:00', 1),
(@d, 2, 'Omoide Yokocho', 'Small alleys with yakitori spots.', 'Shinjuku', '18:00', '19:30', 1),
(@d, 3, 'Golden Gai stroll', 'Tiny bars + photos (be respectful).', 'Shinjuku', '20:00', '21:30', 1);

-- Day 2
set @d := (select trip_day_id from trip_day where trip_id=@trip_japan and day_date='2099-01-02');
insert into activity values
(null, @d, 1, 'Senso-ji Temple', 'Morning temple visit + Nakamise street.', 'Asakusa', '09:00', '11:00', 1),
(null, @d, 2, 'Tokyo Skytree', 'Observation deck + shopping.', 'Sumida', '12:00', '14:00', 1),
(null, @d, 3, 'Ramen dinner', 'Try a local shop near your hotel.', 'Tokyo', '18:30', '20:00', 1);

-- Day 3
set @d := (select trip_day_id from trip_day where trip_id=@trip_japan and day_date='2099-01-03');
insert into activity values
(null, @d, 1, 'Meiji Jingu', 'Quiet shrine walk through forest path.', 'Harajuku', '09:30', '11:00', 1),
(null, @d, 2, 'Takeshita Street', 'Snacks + shopping (go early).', 'Harajuku', '11:15', '12:30', 1),
(null, @d, 3, 'Shibuya Crossing + Hachiko', 'Classic photo stop.', 'Shibuya', '14:00', '15:00', 1);

-- Day 4
set @d := (select trip_day_id from trip_day where trip_id=@trip_japan and day_date='2099-01-04');
insert into activity values
(null, @d, 1, 'Tsukiji Outer Market', 'Street food + breakfast.', 'Tsukiji', '09:00', '10:30', 1),
(null, @d, 2, 'Ginza walk', 'Department stores + coffee.', 'Ginza', '12:00', '14:00', 1),
(null, @d, 3, 'Pack + souvenir run', 'Don Quijote / last-minute gifts.', 'Tokyo', '16:00', '17:00', 1);

-- ================
-- ALBANIA (Tirana) - 3-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Albania', 'Tirana', null, null, 'Template: 3-day Tirana + day trip ideas (history, cafes, views).', 1, true);
set @trip_alb := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-02-01', 'Day 1: City center + museums', @trip_alb),
('2099-02-02', 'Day 2: Dajti Mountain day', @trip_alb),
('2099-02-03', 'Day 3: Food + neighborhoods', @trip_alb);

set @d := (select trip_day_id from trip_day where trip_id=@trip_alb and day_date='2099-02-01');
insert into activity values
(null, @d, 1, 'Skanderbeg Square', 'Main square walk + photos.', 'Tirana', '10:00', '11:00', 1),
(null, @d, 2, 'Bunk’Art 2', 'Cold War history museum.', 'Tirana', '11:30', '13:00', 1),
(null, @d, 3, 'Cafe crawl', 'Try espresso + local desserts.', 'Blloku', '15:00', '16:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_alb and day_date='2099-02-02');
insert into activity values
(null, @d, 1, 'Dajti Ekspres cable car', 'Ride up for views.', 'Dajti', '10:00', '11:00', 1),
(null, @d, 2, 'Hike + viewpoint', 'Light hike + photos.', 'Dajti National Park', '11:15', '13:00', 1),
(null, @d, 3, 'Dinner in Blloku', 'Modern restaurants area.', 'Blloku', '19:00', '20:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_alb and day_date='2099-02-03');
insert into activity values
(null, @d, 1, 'Local market stop', 'Fruits/cheese + quick bites.', 'Tirana', '10:00', '11:00', 1),
(null, @d, 2, 'Grand Park walk', 'Lake loop + relax.', 'Parku i Madh', '12:00', '13:30', 1),
(null, @d, 3, 'Souvenir + coffee', 'Wrap up the trip.', 'Tirana', '15:00', '16:00', 1);

-- ================
-- ITALY (Rome) - 4-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Italy', 'Rome', null, null, 'Template: 4-day Rome (classics + food).', 1, true);
set @trip_it := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-03-01', 'Day 1: Colosseum area', @trip_it),
('2099-03-02', 'Day 2: Vatican', @trip_it),
('2099-03-03', 'Day 3: Trastevere', @trip_it),
('2099-03-04', 'Day 4: Piazza hopping', @trip_it);

set @d := (select trip_day_id from trip_day where trip_id=@trip_it and day_date='2099-03-01');
insert into activity values
(null, @d, 1, 'Colosseum', 'Book timed entry.', 'Colosseum', '09:00', '11:00', 1),
(null, @d, 2, 'Roman Forum', 'Walk through ruins.', 'Foro Romano', '11:15', '13:00', 1),
(null, @d, 3, 'Gelato stop', 'Pick a top-rated gelateria.', 'Rome', '15:00', '15:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_it and day_date='2099-03-02');
insert into activity values
(null, @d, 1, 'Vatican Museums', 'Sistine Chapel included.', 'Vatican City', '09:00', '12:00', 1),
(null, @d, 2, 'St. Peter’s Basilica', 'Climb dome if you want.', 'Vatican City', '13:00', '15:00', 1),
(null, @d, 3, 'Dinner near Prati', 'Good area for food.', 'Prati', '19:00', '20:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_it and day_date='2099-03-03');
insert into activity values
(null, @d, 1, 'Campo de’ Fiori', 'Morning market vibes.', 'Rome', '10:00', '11:00', 1),
(null, @d, 2, 'Trastevere wander', 'Streets + lunch.', 'Trastevere', '12:00', '14:30', 1),
(null, @d, 3, 'Sunset viewpoint', 'Great photo spot.', 'Gianicolo', '18:00', '19:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_it and day_date='2099-03-04');
insert into activity values
(null, @d, 1, 'Trevi Fountain', 'Go early to avoid crowds.', 'Trevi', '08:30', '09:15', 1),
(null, @d, 2, 'Pantheon', 'Quick iconic stop.', 'Pantheon', '10:00', '11:00', 1),
(null, @d, 3, 'Piazza Navona', 'Coffee + people watching.', 'Piazza Navona', '11:15', '12:30', 1);

-- ================
-- USA (California - Los Angeles) - 3-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('USA', 'Los Angeles', null, null, 'Template: 3-day LA (beach, sights, food).', 1, true);
set @trip_ca := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-04-01', 'Day 1: Santa Monica + Venice', @trip_ca),
('2099-04-02', 'Day 2: Hollywood + Griffith', @trip_ca),
('2099-04-03', 'Day 3: Museums + downtown', @trip_ca);

set @d := (select trip_day_id from trip_day where trip_id=@trip_ca and day_date='2099-04-01');
insert into activity values
(null, @d, 1, 'Santa Monica Pier', 'Walk + ocean views.', 'Santa Monica', '10:00', '11:30', 1),
(null, @d, 2, 'Venice Beach', 'Boardwalk + murals.', 'Venice', '12:00', '14:00', 1),
(null, @d, 3, 'Taco dinner', 'Find a local taqueria.', 'LA', '18:30', '20:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_ca and day_date='2099-04-02');
insert into activity values
(null, @d, 1, 'Hollywood Walk of Fame', 'Quick photo stops.', 'Hollywood', '10:00', '11:00', 1),
(null, @d, 2, 'Griffith Observatory', 'Views + sunset.', 'Griffith Park', '16:30', '19:00', 1),
(null, @d, 3, 'Late-night dessert', 'Donuts/ice cream.', 'LA', '20:30', '21:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_ca and day_date='2099-04-03');
insert into activity values
(null, @d, 1, 'The Getty', 'Art + architecture + gardens.', 'Brentwood', '10:00', '13:00', 1),
(null, @d, 2, 'Grand Central Market', 'Lunch with lots of options.', 'Downtown LA', '13:30', '15:00', 1);

-- ================
-- INDONESIA (Bali - Ubud) - 4-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Indonesia', 'Bali (Ubud)', null, null, 'Template: 4-day Bali (Ubud base + temples + relaxing).', 1, true);
set @trip_bali := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-05-01', 'Day 1: Ubud center', @trip_bali),
('2099-05-02', 'Day 2: Rice terraces + swing', @trip_bali),
('2099-05-03', 'Day 3: Temples', @trip_bali),
('2099-05-04', 'Day 4: Spa + chill', @trip_bali);

set @d := (select trip_day_id from trip_day where trip_id=@trip_bali and day_date='2099-05-01');
insert into activity values
(null, @d, 1, 'Ubud Market', 'Souvenirs + snacks.', 'Ubud', '09:30', '10:30', 1),
(null, @d, 2, 'Monkey Forest', 'Go early; watch your stuff.', 'Ubud', '11:00', '12:30', 1),
(null, @d, 3, 'Cafe lunch', 'Smoothie bowl / local food.', 'Ubud', '13:00', '14:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_bali and day_date='2099-05-02');
insert into activity values
(null, @d, 1, 'Tegallalang Rice Terraces', 'Iconic terraces + photos.', 'Tegallalang', '09:00', '10:30', 1),
(null, @d, 2, 'Swing experience', 'Optional tourist swing.', 'Ubud area', '11:00', '12:00', 1),
(null, @d, 3, 'Sunset dinner', 'Relaxed dinner.', 'Ubud', '18:30', '20:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_bali and day_date='2099-05-03');
insert into activity values
(null, @d, 1, 'Goa Gajah', 'Elephant Cave temple.', 'Ubud', '09:30', '11:00', 1),
(null, @d, 2, 'Tirta Empul', 'Water temple rituals (respectful).', 'Tampaksiring', '12:00', '14:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_bali and day_date='2099-05-04');
insert into activity values
(null, @d, 1, 'Balinese massage', 'Spa morning.', 'Ubud', '10:00', '11:30', 1),
(null, @d, 2, 'Pool / downtime', 'Rest day.', 'Ubud', '13:00', '15:00', 1);

-- ================
-- TURKEY (Istanbul) - 4-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Turkey', 'Istanbul', null, null, 'Template: 4-day Istanbul (historic sites + bazaars + views).', 1, true);
set @trip_tr := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-06-01', 'Day 1: Sultanahmet classics', @trip_tr),
('2099-06-02', 'Day 2: Bazaar day', @trip_tr),
('2099-06-03', 'Day 3: Bosphorus vibes', @trip_tr),
('2099-06-04', 'Day 4: Neighborhoods', @trip_tr);

set @d := (select trip_day_id from trip_day where trip_id=@trip_tr and day_date='2099-06-01');
insert into activity values
(null, @d, 1, 'Hagia Sophia area', 'Exterior + nearby walk.', 'Sultanahmet', '09:30', '11:00', 1),
(null, @d, 2, 'Blue Mosque', 'Respect dress code.', 'Sultanahmet', '11:15', '12:15', 1),
(null, @d, 3, 'Turkish breakfast', 'Classic spread.', 'Istanbul', '13:00', '14:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_tr and day_date='2099-06-02');
insert into activity values
(null, @d, 1, 'Grand Bazaar', 'Shop + explore.', 'Fatih', '10:00', '12:00', 1),
(null, @d, 2, 'Spice Bazaar', 'Tea + spices.', 'Eminönü', '12:30', '13:30', 1),
(null, @d, 3, 'Baklava stop', 'Dessert break.', 'Karaköy', '15:00', '15:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_tr and day_date='2099-06-03');
insert into activity values
(null, @d, 1, 'Bosphorus cruise', 'Day or sunset cruise.', 'Bosphorus', '11:00', '12:30', 1),
(null, @d, 2, 'Ortaköy', 'Seaside mosque + kumpir.', 'Ortaköy', '13:00', '15:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_tr and day_date='2099-06-04');
insert into activity values
(null, @d, 1, 'Galata Tower area', 'Walk + views.', 'Galata', '10:00', '11:30', 1),
(null, @d, 2, 'Istiklal Street', 'Shopping + snacks.', 'Beyoğlu', '12:00', '14:00', 1);

-- ================
-- SINGAPORE - 3-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Singapore', 'Singapore', null, null, 'Template: 3-day Singapore (gardens, food, neighborhoods).', 1, true);
set @trip_sg := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-07-01', 'Day 1: Marina Bay', @trip_sg),
('2099-07-02', 'Day 2: Gardens + museums', @trip_sg),
('2099-07-03', 'Day 3: Neighborhoods', @trip_sg);

set @d := (select trip_day_id from trip_day where trip_id=@trip_sg and day_date='2099-07-01');
insert into activity values
(null, @d, 1, 'Marina Bay Sands area', 'Walk the bay.', 'Marina Bay', '10:00', '11:30', 1),
(null, @d, 2, 'Hawker center lunch', 'Try chicken rice.', 'Singapore', '12:00', '13:00', 1),
(null, @d, 3, 'Supertree Grove', 'Evening lights show.', 'Gardens by the Bay', '18:30', '20:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_sg and day_date='2099-07-02');
insert into activity values
(null, @d, 1, 'Cloud Forest', 'Indoor waterfall + walkways.', 'Gardens by the Bay', '10:00', '11:30', 1),
(null, @d, 2, 'ArtScience Museum', 'Cool exhibits.', 'Marina Bay', '13:00', '14:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_sg and day_date='2099-07-03');
insert into activity values
(null, @d, 1, 'Chinatown', 'Temple + shops.', 'Chinatown', '10:00', '12:00', 1),
(null, @d, 2, 'Little India', 'Food + color.', 'Little India', '14:00', '16:00', 1);

-- ================
-- PORTUGAL (Lisbon) - 3-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Portugal', 'Lisbon', null, null, 'Template: 3-day Lisbon (views, trams, pastries).', 1, true);
set @trip_pt := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-08-01', 'Day 1: Alfama', @trip_pt),
('2099-08-02', 'Day 2: Belém', @trip_pt),
('2099-08-03', 'Day 3: Bairro Alto', @trip_pt);

set @d := (select trip_day_id from trip_day where trip_id=@trip_pt and day_date='2099-08-01');
insert into activity values
(null, @d, 1, 'Miradouro stop', 'Viewpoint photos.', 'Alfama', '10:00', '10:45', 1),
(null, @d, 2, 'Alfama wander', 'Streets + tiles.', 'Alfama', '11:00', '13:00', 1),
(null, @d, 3, 'Pastel snack', 'Try a bakery.', 'Lisbon', '15:00', '15:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_pt and day_date='2099-08-02');
insert into activity values
(null, @d, 1, 'Belém Tower area', 'Walk the waterfront.', 'Belém', '10:00', '11:00', 1),
(null, @d, 2, 'Pasteis de Belém', 'Iconic pastry stop.', 'Belém', '11:15', '12:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_pt and day_date='2099-08-03');
insert into activity values
(null, @d, 1, 'Tram ride', 'Classic Lisbon trams.', 'Lisbon', '10:30', '11:30', 1),
(null, @d, 2, 'Bairro Alto dinner', 'Evening food + vibes.', 'Bairro Alto', '19:00', '20:30', 1);

-- ================
-- FRANCE (Paris) - 4-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('France', 'Paris', null, null, 'Template: 4-day Paris (museums, neighborhoods, cafes).', 1, true);
set @trip_fr := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-09-01', 'Day 1: Eiffel + Seine', @trip_fr),
('2099-09-02', 'Day 2: Louvre + Tuileries', @trip_fr),
('2099-09-03', 'Day 3: Montmartre', @trip_fr),
('2099-09-04', 'Day 4: Marais', @trip_fr);

set @d := (select trip_day_id from trip_day where trip_id=@trip_fr and day_date='2099-09-01');
insert into activity values
(null, @d, 1, 'Eiffel Tower area', 'Book ahead if you go up.', 'Eiffel Tower', '10:00', '12:00', 1),
(null, @d, 2, 'Seine walk', 'Stroll along the river.', 'Seine', '14:00', '15:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_fr and day_date='2099-09-02');
insert into activity values
(null, @d, 1, 'Louvre Museum', 'Must-see highlights.', 'Louvre', '09:30', '12:30', 1),
(null, @d, 2, 'Tuileries Garden', 'Relax + photos.', 'Tuileries', '13:00', '14:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_fr and day_date='2099-09-03');
insert into activity values
(null, @d, 1, 'Sacré-Cœur', 'Views over Paris.', 'Montmartre', '10:00', '11:00', 1),
(null, @d, 2, 'Montmartre streets', 'Cafes + art.', 'Montmartre', '11:15', '13:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_fr and day_date='2099-09-04');
insert into activity values
(null, @d, 1, 'Le Marais wander', 'Shops + architecture.', 'Le Marais', '10:30', '12:30', 1),
(null, @d, 2, 'Coffee + pastry break', 'Pick a cafe you like.', 'Paris', '15:00', '15:45', 1);

-- ================
-- SPAIN (Barcelona) - 3-day template
-- ================
insert into trip (country, city, start_date, end_date, notes, owner_user_id, is_template)
values ('Spain', 'Barcelona', null, null, 'Template: 3-day Barcelona (Gaudí, beach, tapas).', 1, true);
set @trip_es := last_insert_id();

insert into trip_day (day_date, day_notes, trip_id) values
('2099-10-01', 'Day 1: Gothic Quarter', @trip_es),
('2099-10-02', 'Day 2: Gaudí day', @trip_es),
('2099-10-03', 'Day 3: Beach + tapas', @trip_es);

set @d := (select trip_day_id from trip_day where trip_id=@trip_es and day_date='2099-10-01');
insert into activity values
(null, @d, 1, 'Gothic Quarter walk', 'Streets + plazas.', 'Barri Gòtic', '10:00', '12:00', 1),
(null, @d, 2, 'La Boqueria', 'Market snacks.', 'Las Ramblas', '12:30', '13:30', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_es and day_date='2099-10-02');
insert into activity values
(null, @d, 1, 'Sagrada Família', 'Book timed entry.', 'Eixample', '09:30', '11:30', 1),
(null, @d, 2, 'Park Güell', 'Views + Gaudí.', 'Gràcia', '13:00', '15:00', 1);

set @d := (select trip_day_id from trip_day where trip_id=@trip_es and day_date='2099-10-03');
insert into activity values
(null, @d, 1, 'Beach morning', 'Relax + swim.', 'Barceloneta', '10:00', '12:00', 1),
(null, @d, 2, 'Tapas night', 'Try 2-3 spots.', 'Barcelona', '19:00', '21:00', 1);
