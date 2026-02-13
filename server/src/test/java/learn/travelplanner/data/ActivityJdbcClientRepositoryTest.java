package learn.travelplanner.data;

import learn.travelplanner.models.Activity;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import learn.travelplanner.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ActivityJdbcClientRepositoryTest {

    @Autowired
    private ActivityJdbcClientRepository repository;

    @Autowired
    private UserJdbcClientRepository userRepository;

    @Autowired
    private TripsJdbcClientRepository tripRepository;

    @Autowired
    private TripDayJdbcClientRepository tripDayRepository;

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void setup() {
        jdbcClient.sql("call set_known_good_state();").update();
    }
    @Test
    void shouldFindByTripId() {
        List<Activity> activities = repository.findByTripId(1);

        assertNotNull(activities);
        assertEquals(4, activities.size());

        assertNotNull(activities.get(0).getTripDay());
        assertTrue(activities.get(0).getTripDay().getTripDayId() > 0);

        assertEquals(1, activities.get(0).getTripDay().getTripDayId());
        assertEquals(1, activities.get(0).getOrderIndex());
        assertEquals(1, activities.get(1).getTripDay().getTripDayId());
        assertEquals(2, activities.get(1).getOrderIndex());
    }

    @Test
    void shouldReturnEmptyWhenTripIdNotFound() {
        List<Activity> activities = repository.findByTripId(999);
        assertNotNull(activities);
        assertEquals(0, activities.size());
    }

    @Test
    void shouldCreateActivityWithAllFields() {

        User owner = userRepository.findByEmail("b@test.com");

        Trip trip = tripRepository.findById(1);

        List<TripDay> tripDay = tripDayRepository.findByTripId(1);

        Activity activity = new Activity();
        activity.setTripDay(tripDay.get(0));
        activity.setOrderIndex(3);
        activity.setTitle("Senso-ji Temple");
        activity.setDescription("Morning visit");
        activity.setLocation("Asakusa");
        activity.setStartTime(LocalTime.of(9, 0));
        activity.setEndTime(LocalTime.of(11, 0));
        activity.setCreatedBy(owner);

        Activity actual = repository.create(activity);

        assertNotNull(actual);
        assertTrue(actual.getActivityId() > 0);


        assertEquals("Senso-ji Temple", actual.getTitle());
        assertEquals(3, actual.getOrderIndex());
        assertEquals(trip.getTripId(), tripDay.get(0).getTrip().getTripId());
        assertEquals(owner.getUserId(), actual.getCreatedBy().getUserId());
    }


}