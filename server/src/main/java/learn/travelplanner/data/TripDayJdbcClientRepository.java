package learn.travelplanner.data;

import learn.travelplanner.data.mappers.TripDayMapper;
import learn.travelplanner.models.TripDay;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TripDayJdbcClientRepository implements TripDayRepository{
    private final JdbcClient jdbcClient;

    public TripDayJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    @Override
    public List<TripDay> findByTripId(int tripId) throws DataAccessException {
        final String sql = """
                SELECT trip_day_id, day_date, day_notes, trip_id
                from trip_day
                where trip_id = ?
                order by day_date;
                """;

        return jdbcClient.sql(sql)
                .param(tripId)
                .query(new TripDayMapper())
                .list();
    }

    @Override
    public TripDay create(TripDay tripDay) throws DataAccessException {

        final String sql = """
        insert into trip_day (day_date, day_notes, trip_id)
        values (:day_date, :day_notes, :trip_id);
        """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rows = jdbcClient.sql(sql)
                .param("day_date", tripDay.getDayDate())
                .param("day_notes", tripDay.getDayNotes())
                .param("trip_id", tripDay.getTrip().getTripId())
                .update(keyHolder);

        if (rows <= 0) {
            return null;
        }

        tripDay.setTripDayId(keyHolder.getKey().intValue());
        return tripDay;
    }

}
