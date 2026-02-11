package learn.travelplanner.data;

import learn.travelplanner.models.Trip;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripsJdbcClientRepositoryTest {

    @Autowired
    private TripsJdbcClientRepository repository;

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void setup() {
        jdbcClient.sql("call set_known_good_state();").update();
    }

    @Test
    void shouldFindTemplates() throws DataAccessException {
        List<Trip> result = repository.findTemplates();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getCity().equals("Chicago"));
    }

}