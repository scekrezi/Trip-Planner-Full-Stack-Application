package learn.travelplanner.domain;

import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.Trip;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripServiceTest {
    @Autowired
    TripService service;

    @MockBean
    TripsRepository repository;

    @MockBean
    UserRepository userRepository;

    @Test
    void findByIdHappyPath() throws DataAccessException {
        Trip trip = new Trip();
        trip.setTripId(1);

        when(repository.findById(1)).thenReturn(trip);
        Result<Trip> result = service.findById(1);
        assertTrue(result.isSuccess());
        assertNotNull(result.getPayload());
        assertEquals(1, result.getPayload().getTripId());
    }

    @Test
    void findByIdFailsToFind() throws DataAccessException {
        when(repository.findById(999)).thenReturn(null);

        Result<Trip> result = service.findById(999);

        assertFalse(result.isSuccess());
        assertNull(result.getPayload());
        assertEquals(ResultType.NOT_FOUND, result.getResultType());
    }
}