package learn.travelplanner.data;

import learn.travelplanner.models.Trip;
import learn.travelplanner.models.User;
import learn.travelplanner.models.TripMember;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripMemberJdbcClientRepositoryTest {
    @Autowired
    private TripMemberJdbcClientRepository repository;

    @Autowired
    JdbcClient jdbcClient;

    @BeforeEach
    void setup() {
        jdbcClient.sql("call set_known_good_state();").update();
    }

    @Test
    void shouldAdd() {
        Trip trip = new Trip();
        trip.setTripId(1);

        User user = new User();
        user.setUserId(2);

        TripMember result = new TripMember();
        result.setTrip(trip);
        result.setUser(user);
        result.setRole("VIEWER");
        TripMember tripMember = repository.add(result);
        assertNotNull(tripMember);
        assertTrue(tripMember.getRole().equals("VIEWER"));
    }
    @Test
    void shouldFindByTripId() {
        List<TripMember> members = repository.findByTripId(2);
        assertNotNull(members);
        assertFalse(members.isEmpty());
    }

    @Test
    void shouldReturnEmptyListWhenTripIdNotFound() {
        List<TripMember> members = repository.findByTripId(999);
        assertTrue(members.isEmpty());
    }



}