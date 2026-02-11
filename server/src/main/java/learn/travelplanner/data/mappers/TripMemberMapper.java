package learn.travelplanner.data.mappers;

import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripMember;
import learn.travelplanner.models.User;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class TripMemberMapper implements RowMapper<TripMember> {
    @Override
    public TripMember mapRow(ResultSet rs, int rowNum) throws SQLException {

        Trip trip = new Trip();
        trip.setTripId(rs.getInt("trip_id"));

        User user = new User();
        user.setUserId(rs.getInt("user_id"));

        TripMember tripMember = new TripMember();
        tripMember.setTrip(trip);
        tripMember.setUser(user);
        tripMember.setRole(rs.getString("role"));
        return tripMember;
    }
}
