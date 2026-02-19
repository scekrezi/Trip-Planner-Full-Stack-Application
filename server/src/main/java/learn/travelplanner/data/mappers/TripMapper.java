package learn.travelplanner.data.mappers;

import learn.travelplanner.models.Trip;
import learn.travelplanner.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;

public class TripMapper implements RowMapper<Trip> {
    @Override
    public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {

        User owner = new User();
        owner.setUserId(rs.getInt("owner_user_id"));

        Trip trip = new Trip();
        trip.setTripId(rs.getInt("trip_id"));
        trip.setCountry(rs.getString("country"));
        trip.setCity(rs.getString("city"));

        Date start = rs.getDate("start_date");
        if (start != null) {
            trip.setStartDate(start.toLocalDate());
        }

        Date end = rs.getDate("end_date");
        if (end != null) {
            trip.setEndDate(end.toLocalDate());

        }

        trip.setNotes(rs.getString("notes"));
        trip.setTemplate(rs.getBoolean("is_template"));
        trip.setOwner(owner);
        try {
            String myRole = rs.getString("my_role");
            if (myRole != null) {
                trip.setMyRole(myRole);
            }
        } catch (SQLException ignored) {
        }

        return trip;
    }
}
