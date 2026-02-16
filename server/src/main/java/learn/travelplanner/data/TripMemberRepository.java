package learn.travelplanner.data;

import learn.travelplanner.models.TripMember;
import org.springframework.jdbc.core.simple.JdbcClient;

public interface TripMemberRepository {
    TripMember add(TripMember member);
}
