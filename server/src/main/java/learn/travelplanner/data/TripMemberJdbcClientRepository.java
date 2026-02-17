package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripMemberMapper;
import learn.travelplanner.models.TripMember;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    @Override
    public List<TripMember> findByTripId(int tripId) {
        final String sql = """
            select trip_id, user_id, role
            from trip_member
            where trip_id = :trip_id;
            """;

        return jdbcClient.sql(sql)
                .param("trip_id", tripId)
                .query(new TripMemberMapper())
                .list();
    }

    @Override
    public boolean isMember(int tripId, int userId) {
        final String sql = """
        select count(*)
        from trip_member
        where trip_id = :trip_id and user_id = :user_id;
        """;

        Integer count = jdbcClient.sql(sql)
                .param("trip_id", tripId)
                .param("user_id", userId)
                .query(Integer.class)
                .single();

        return count != null && count > 0;
    }


}
