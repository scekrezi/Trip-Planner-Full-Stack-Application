package learn.travelplanner.data;


import learn.travelplanner.data.mappers.ActivityMapper;
import learn.travelplanner.models.Activity;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ActivityJdbcClientRepository implements ActivityRepository{
    private final JdbcClient jdbcClient;

    public ActivityJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public List<Activity> findByTripId(int tripId) throws DataAccessException {
        final String sql = """
            SELECT a.activity_id, a.trip_day_id, a.order_index,
                   a.title, a.description, a.location,
                   a.start_time, a.end_time, a.created_by_user_id
            FROM activity a
            join trip_day td on td.trip_day_id = a.trip_day_id
            WHERE td.trip_id = ?
            order by td.day_date, a.order_index;
            """;

        return jdbcClient.sql(sql)
                .param(tripId)
                .query(new ActivityMapper())
                .list();
    }
}
