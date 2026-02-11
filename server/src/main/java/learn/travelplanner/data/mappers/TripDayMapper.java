package learn.travelplanner.data.mappers;


import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TripDayMapper implements RowMapper<TripDay> {
    @Override
    public TripDay mapRow(ResultSet rs, int rowNum) throws SQLException {
        Trip trip = new Trip();
        trip.setTripId(rs.getInt("trip_id"));

        TripDay tripDay = new TripDay();
        tripDay.setTripDayId(rs.getInt("trip_day_id"));
        tripDay.setDayDate(rs.getDate("day_date").toLocalDate());
        tripDay.setDayNotes(rs.getString("day_notes"));
        tripDay.setTrip(trip);

        tripDay.setTrip(trip);
        return tripDay;
    }
}
