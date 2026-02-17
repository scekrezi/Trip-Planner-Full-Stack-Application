package learn.travelplanner.domain;

import learn.travelplanner.data.TripMemberRepository;
import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripMember;
import learn.travelplanner.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DuplicateKeyException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class TripMemberServiceTest {
    @Autowired
    TripMemberService service;

    @MockBean
    TripMemberRepository tripMemberRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    TripsRepository tripsRepository;

    @Test
    void addMember_shouldAddWhenValid() {
        Trip trip = new Trip();
        trip.setTripId(1);

        User user = new User();
        user.setUserId(2);
        user.setEmail("b@test.com");

        when(tripsRepository.findById(1)).thenReturn(trip);
        when(userRepository.findByEmail("b@test.com")).thenReturn(user);
        TripMember tripMember = new TripMember(trip, user, "VIEWER");
        when(tripMemberRepository.add(tripMember)).thenReturn(tripMember);

        Result<TripMember> result = service.addMember(1, "b@test.com", "VIEWER");

        assertTrue(result.isSuccess());
        assertNotNull(result.getPayload());
        assertEquals("VIEWER", result.getPayload().getRole());
    }

    @Test
    void addMember_shouldFailWhenTripNotFound() {
        when(tripsRepository.findById(1)).thenReturn(null);

        Result<TripMember> result = service.addMember(1, "b@test.com", "VIEWER");

        assertFalse(result.isSuccess());
    }

    @Test
    void addMember_shouldFailWhenUserNotFound() {
        Trip trip = new Trip();
        trip.setTripId(1);

        when(tripsRepository.findById(1)).thenReturn(trip);
        when(userRepository.findByEmail("missing@test.com")).thenReturn(null);

        Result<TripMember> result = service.addMember(1, "missing@test.com", "VIEWER");

        assertFalse(result.isSuccess());
    }

    @Test
    void addMember_shouldFailOnDuplicate() {
        Trip trip = new Trip();
        trip.setTripId(1);

        User user = new User();
        user.setUserId(1);
        user.setEmail("a@test.com");

        when(tripsRepository.findById(1)).thenReturn(trip);
        when(userRepository.findByEmail("a@test.com")).thenReturn(user);
        when(tripMemberRepository.add(any(TripMember.class)))
                .thenThrow(new DuplicateKeyException("dup"));

        Result<TripMember> result = service.addMember(1, "a@test.com", "VIEWER");

        assertFalse(result.isSuccess());
    }

    @Test
    void findMembers_shouldReturnMembersWhenTripExists() {
        Trip trip = new Trip();
        trip.setTripId(1);

        when(tripsRepository.findById(1)).thenReturn(trip);
        when(tripMemberRepository.findByTripId(1)).thenReturn(List.of(new TripMember()));

        Result<List<TripMember>> result = service.findMembers(1);

        assertTrue(result.isSuccess());
        assertNotNull(result.getPayload());
        assertEquals(1, result.getPayload().size());
    }

    @Test
    void findMembers_shouldFailWhenTripNotFound() {
        when(tripsRepository.findById(1)).thenReturn(null);

        Result<List<TripMember>> result = service.findMembers(1);

        assertFalse(result.isSuccess());
    }
}