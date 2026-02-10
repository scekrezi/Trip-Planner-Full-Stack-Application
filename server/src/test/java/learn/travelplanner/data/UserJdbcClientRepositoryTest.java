package learn.travelplanner.data;

import learn.travelplanner.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserJdbcClientRepositoryTest {

    @Autowired
    private UserJdbcClientRepository repository;

    @Autowired
    private JdbcClient jdbcClient;

    @BeforeEach
    void setup() {
        jdbcClient.sql("call set_known_good_state();").update();
    }


    @Test
    void findByEmailHappyPath() {
        User user = repository.findByEmail("a@test.com");

        assertNotNull(user);
        assertEquals(1, user.getUserId());
        assertEquals("a@test.com", user.getEmail());
        assertEquals("passA", user.getPassword());

    }
    @Test
    void findByEmailFailsToFind() throws DataAccessException {
        User actual = repository.findByEmail("does@not.exist");

        assertNull(actual);
    }

    @Test
    void shouldCreate() {
        User toCreate = new User();
        toCreate.setEmail("new@test.com");
        toCreate.setPassword("newPass");

        User actual = repository.create(toCreate);

        assertNotNull(actual);
        assertTrue(actual.getUserId() > 0);

        User fromDb = repository.findByEmail("new@test.com");
        assertNotNull(fromDb);
        assertEquals(actual.getUserId(), fromDb.getUserId());
        assertEquals("new@test.com", fromDb.getEmail());
        assertEquals("newPass", fromDb.getPassword());
    }
}