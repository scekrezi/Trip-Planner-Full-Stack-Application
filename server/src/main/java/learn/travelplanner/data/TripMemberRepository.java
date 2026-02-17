package learn.travelplanner.data;

import learn.travelplanner.models.TripMember;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.util.List;

public interface TripMemberRepository {
    TripMember add(TripMember member);
    List<TripMember> findByTripId(int tripId);
}
