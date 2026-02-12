package learn.travelplanner.domain;

import learn.travelplanner.data.ActivityRepository;
import learn.travelplanner.data.TripDayRepository;
import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.Activity;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import learn.travelplanner.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripServiceTest {
    @Autowired
    TripService service;

    @MockBean
    TripsRepository repository;

    @MockBean
    TripDayRepository tripDayRepository;

    @MockBean
    ActivityRepository activityRepository;

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

    @Test
    void shouldReturnNotFoundWhenTripMissing() {
        when(repository.findById(999)).thenReturn(null);

        Result<Trip> result = service.findByIdWithDetails(999);

        assertFalse(result.isSuccess());

        assertEquals(ResultType.NOT_FOUND, result.getResultType());
        assertNull(result.getPayload());

    }

    @Test
    void shouldFindTripsWithDetails() {
        Trip trip = new Trip();
        trip.setTripId(1);
        trip.setCity("Chicago");
        trip.setCountry("USA");

        User owner = new User();
        owner.setUserId(1);
        trip.setOwner(owner);

        when(repository.findById(1)).thenReturn(trip);

        TripDay day1 = new TripDay();
        day1.setTripDayId(10);

        TripDay day2 = new TripDay();
        day2.setTripDayId(11);

        when(tripDayRepository.findByTripId(1)).thenReturn(List.of(day1, day2));

        Activity a1 = new Activity();
        a1.setActivityId(100);
        TripDay a1Day = new TripDay();
        a1Day.setTripDayId(10);
        a1.setTripDay(a1Day);

        Activity a2 = new Activity();
        a2.setActivityId(101);
        TripDay a2Day = new TripDay();
        a2Day.setTripDayId(10);
        a2.setTripDay(a2Day);

        Activity a3 = new Activity();
        a3.setActivityId(102);
        TripDay a3Day = new TripDay();
        a3Day.setTripDayId(11);
        a3.setTripDay(a3Day);

        when(activityRepository.findByTripId(1)).thenReturn(List.of(a1, a2, a3));

        Result<Trip> result = service.findByIdWithDetails(1);

        assertTrue(result.isSuccess());
        Trip payload = result.getPayload();
        assertNotNull(payload);

        assertNotNull(payload.getDays());
        assertEquals(2, payload.getDays().size());

        TripDay payloadDay1 = payload.getDays().get(0);
        TripDay payloadDay2 = payload.getDays().get(1);

        // Day1 should have 2 activities
        assertNotNull(payloadDay1.getActivities());
        assertEquals(2, payloadDay1.getActivities().size());
        assertEquals(100, payloadDay1.getActivities().get(0).getActivityId());
        assertEquals(101, payloadDay1.getActivities().get(1).getActivityId());

        // Day2 should have 1 activity
        assertNotNull(payloadDay2.getActivities());
        assertEquals(1, payloadDay2.getActivities().size());
        assertEquals(102, payloadDay2.getActivities().get(0).getActivityId());

    }



}