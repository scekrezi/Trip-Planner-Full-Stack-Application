package learn.travelplanner.data;


import learn.travelplanner.data.mappers.ActivityMapper;
import learn.travelplanner.models.Activity;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ActivityJdbcClientRepository implements ActivityRepository {
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

    @Override
    public Activity create(Activity activity) throws DataAccessException {
        final String sql = """
                insert into activity
                    (trip_day_id, order_index, title, description, location, start_time, end_time, created_by_user_id)
                values
                    (:trip_day_id, :order_index, :title, :description, :location, :start_time, :end_time, :created_by_user_id);
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcClient.sql(sql)
                .param("trip_day_id", activity.getTripDay().getTripDayId())
                .param("order_index", activity.getOrderIndex())
                .param("title", activity.getTitle())
                .param("description", activity.getDescription())
                .param("location", activity.getLocation())
                .param("start_time", activity.getStartTime())
                .param("end_time", activity.getEndTime())
                .param("created_by_user_id", activity.getCreatedBy().getUserId())
                .update(keyHolder);

        if (rows <= 0) {
            return null;
        }

        activity.setActivityId(keyHolder.getKey().intValue());
        return activity;
    }
}
