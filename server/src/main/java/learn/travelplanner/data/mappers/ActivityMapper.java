package learn.travelplanner.data.mappers;

import learn.travelplanner.models.Activity;
import learn.travelplanner.models.TripDay;
import learn.travelplanner.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;

public class ActivityMapper implements RowMapper<Activity> {

    @Override
    public Activity mapRow(ResultSet rs, int rowNum) throws SQLException {

        TripDay tripDay = new TripDay();
        tripDay.setTripDayId(rs.getInt("trip_day_id"));

        User createdBy = new User();
        createdBy.setUserId(rs.getInt("created_by_user_id"));

        Activity activity = new Activity();
        activity.setActivityId(rs.getInt("activity_id"));
        activity.setTripDay(tripDay);
        activity.setOrderIndex(rs.getInt("order_index"));
        activity.setTitle(rs.getString("title"));
        activity.setDescription(rs.getString("description"));
        activity.setLocation(rs.getString("location"));
        Time start = rs.getTime("start_time");
        if (start != null) {
            activity.setStartTime(start.toLocalTime());
        }

        Time end = rs.getTime("end_time");
        if (end != null) {
            activity.setEndTime(end.toLocalTime());
        }
        activity.setCreatedBy(createdBy);

        return activity;
    }
}
