package learn.travelplanner.data;

import learn.travelplanner.models.Activity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ActivityJdbcClientRepositoryTest {

    @Autowired
    private ActivityJdbcClientRepository repository;

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
}