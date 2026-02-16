package learn.travelplanner.data;

import learn.travelplanner.models.TripMember;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class TripMemberJdbcClientRepository implements TripMemberRepository{

    private final JdbcClient jdbcClient;

    public TripMemberJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public TripMember add(TripMember member) {
        final String sql = """
                insert into trip_member(trip_id, user_id, role)
                values(:trip_id, :user_id, :role);
                """;

        int rowsAffected = jdbcClient.sql(sql)
                .param("trip_id", member.getTrip().getTripId())
                .param("user_id", member.getUser().getUserId())
                .param("role", member.getRole())
                .update();

        if(rowsAffected <= 0){
            return null;
        }
        return member;
    }
}
