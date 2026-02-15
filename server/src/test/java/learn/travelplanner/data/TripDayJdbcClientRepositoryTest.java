package learn.travelplanner.data;

import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import learn.travelplanner.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripDayJdbcClientRepositoryTest {

    @Autowired
    private TripDayJdbcClientRepository repository;

    @Autowired
    private TripsJdbcClientRepository tripRepository;

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void setup() {
        jdbcClient.sql("call set_known_good_state();").update();
    }

    @Test
    void findByTripId() {
        List<TripDay> actual = repository.findByTripId(1);

        assertTrue(actual.size() == 3);
        assertTrue(actual.get(0).getDayNotes().equals("Day 1: Downtown"));
    }

    @Test
    void shouldCreateTripDay() {

        Trip trip = tripRepository.findById(1);

        TripDay day = new TripDay();
        day.setDayDate(LocalDate.of(2027, 3, 10));
        day.setDayNotes("Arrival day");
        day.setTrip(trip);

        TripDay actual = repository.create(day);

        assertNotNull(actual);
        assertTrue(actual.getTripDayId() > 0);


        assertTrue(actual.getDayNotes().equals("Arrival day"));
    }

}