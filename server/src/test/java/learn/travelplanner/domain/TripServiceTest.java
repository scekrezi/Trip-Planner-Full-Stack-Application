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

import java.time.LocalDate;
import java.time.LocalTime;
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

        assertNotNull(payloadDay1.getActivities());
        assertEquals(2, payloadDay1.getActivities().size());
        assertEquals(100, payloadDay1.getActivities().get(0).getActivityId());
        assertEquals(101, payloadDay1.getActivities().get(1).getActivityId());

        assertNotNull(payloadDay2.getActivities());
        assertEquals(1, payloadDay2.getActivities().size());
        assertEquals(102, payloadDay2.getActivities().get(0).getActivityId());

    }

    @Test
    void shouldCreateTripWithDaysAndActivities() {

        User owner = new User(1, "TEST", "password");

        assertNotNull(owner);
        assertTrue(owner.getUserId() > 0);

        Trip trip = new Trip();
        trip.setTripId(1);
        trip.setCountry("Japan");
        trip.setCity("Tokyo");
        trip.setStartDate(LocalDate.of(2026, 3, 10));
        trip.setEndDate(LocalDate.of(2026, 3, 12));
        trip.setNotes("Service test trip");
        trip.setOwner(owner);
        trip.setTemplate(false);

        TripDay day1 = new TripDay();
        day1.setTripDayId(1);
        day1.setDayDate(LocalDate.of(2026, 3, 10));
        day1.setDayNotes("Day One Notes");

        Activity a1 = new Activity();
        a1.setActivityId(1);
        a1.setTitle("Check-in");
        a1.setDescription(null);
        a1.setLocation("Hotel");
        a1.setStartTime(LocalTime.of(15, 0));
        a1.setEndTime(LocalTime.of(16, 0));

        Activity a2 = new Activity();
        a2.setActivityId(2);
        a2.setTitle("Dinner");
        a2.setDescription(null);
        a2.setLocation("Shinjuku");
        a2.setStartTime(LocalTime.of(19, 0));
        a2.setEndTime(LocalTime.of(21, 0));

        day1.setActivities(List.of(a1, a2));

        TripDay day2 = new TripDay();
        day2.setTripDayId(2);
        day2.setDayDate(LocalDate.of(2026, 3, 11));
        day2.setDayNotes("Explore");
        day2.setActivities(List.of());

        trip.setDays(List.of(day1, day2));

        when(repository.create(org.mockito.ArgumentMatchers.any(Trip.class))).thenReturn(trip);
        when(tripDayRepository.create(org.mockito.ArgumentMatchers.any(TripDay.class))).thenReturn(day1, day2);
        when(activityRepository.create(org.mockito.ArgumentMatchers.any(Activity.class))).thenReturn(a1, a2);

        Trip saved = service.createTripWithDetails(trip);

        assertNotNull(saved);
        assertTrue(saved.getTripId() > 0);

    }
    @Test
    void shouldReturnUpcomingTrips() {
        LocalDate today = LocalDate.now();

        Trip future = new Trip();
        future.setTripId(1);
        future.setEndDate(today.plusDays(2));

        Trip past = new Trip();
        past.setTripId(2);
        past.setEndDate(today.minusDays(1));

        when(repository.findByOwnerId(1)).thenReturn(List.of(future, past));

        List<Trip> result = service.findUpcomingByOwnerId(1);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getTripId());
    }

    @Test
    void shouldReturnPastTrips() {
        LocalDate today = LocalDate.now();

        Trip past = new Trip();
        past.setTripId(10);
        past.setEndDate(today.minusDays(3));

        Trip future = new Trip();
        future.setTripId(20);
        future.setEndDate(today.plusDays(3));

        when(repository.findByOwnerId(1)).thenReturn(List.of(past, future));

        List<Trip> result = service.findPastByOwnerId(1);

        assertEquals(1, result.size());
        assertEquals(10, result.get(0).getTripId());
    }

    @Test
    void shouldTreatNullEndDateAsUpcoming() {
        Trip ongoing = new Trip();
        ongoing.setTripId(5);
        ongoing.setEndDate(null);

        when(repository.findByOwnerId(1)).thenReturn(List.of(ongoing));

        List<Trip> result = service.findUpcomingByOwnerId(1);

        assertEquals(1, result.size());
    }

    @Test
    void shouldDeleteTripHappyPath() {
        when(repository.deleteById(1, 1)).thenReturn(true);

        Result<Trip> result = service.deleteById(1, 1);

        assertTrue(result.isSuccess());
    }

    @Test
    void shouldFailWhenDeleteReturnsFalse() {
        when(repository.deleteById(1, 1)).thenReturn(false);

        Result<Trip> result = service.deleteById(1, 1);

        assertFalse(result.isSuccess());
        assertEquals(ResultType.NOT_FOUND, result.getResultType());
    }

    @Test
    void shouldReturnUpcomingInvitedTrips() {
        LocalDate today = LocalDate.now();

        Trip future = new Trip();
        future.setTripId(1);
        future.setEndDate(today.plusDays(2));
        future.setMyRole("EDITOR");

        Trip past = new Trip();
        past.setTripId(2);
        past.setEndDate(today.minusDays(1));
        past.setMyRole("VIEWER");

        when(repository.findInvitedByUserId(2))
                .thenReturn(List.of(future, past));

        List<Trip> result = service.findUpcomingInvited(2);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getTripId());
    }

    @Test
    void shouldReturnPastInvitedTrips() {
        LocalDate today = LocalDate.now();

        Trip past = new Trip();
        past.setTripId(10);
        past.setEndDate(today.minusDays(3));
        past.setMyRole("VIEWER");

        Trip future = new Trip();
        future.setTripId(20);
        future.setEndDate(today.plusDays(3));
        future.setMyRole("EDITOR");

        when(repository.findInvitedByUserId(2))
                .thenReturn(List.of(past, future));

        List<Trip> result = service.findPastInvited(2);

        assertEquals(1, result.size());
        assertEquals(10, result.get(0).getTripId());
    }











}